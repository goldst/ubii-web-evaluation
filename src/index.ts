import ProtobufLibrary from '@tum-far/ubii-msg-formats/dist/js/protobuf';
import { UbiiClientService } from '@tum-far/ubii-node-webbrowser';
import { EvaluatorOptions } from './EvaluatorOptions';

export interface TopicLog {
    timestamp: Date;
    data: ProtobufLibrary.ubii.dataStructure.IObject3DList
}

/**
 * Main class of the evaluation module. Instantiating this class will
 * set up everything that is necessary to log object3D lists from two
 * topics. The complete result is printed when calling {stop}, otherwise
 * to use data it can be obtained using the onNewData option.
 */
export class Evaluator {
    started = false;
    ubiiDevice?: Partial<ProtobufLibrary.ubii.devices.Device>;
    ubiiComponentA?: ProtobufLibrary.ubii.devices.IComponent;
    ubiiComponentB?: ProtobufLibrary.ubii.devices.IComponent;

    logA: TopicLog[] = [];
    logB: TopicLog[] = [];

    options: EvaluatorOptions;

    /**
     * This creates the evaluator, which then automatically connects to
     * the Ubi Interact master node and starts sending, evaluating and
     * publishing information
     * @param options See {Evaluator} for documentation on the
     *   default values
     */
    constructor(options: Partial<EvaluatorOptions> = {}) {
        this.options = {
            urlServices: 'http://localhost:8102/services/json',
            urlTopicData: 'ws://localhost:8104/topicdata',
            topicATags: ['ik targets'],
            topicBTags: ['avatar', 'bones', 'pose', 'position', 'orientation', 'quaternion'],
            onNewData: () => {/*do nothing*/ },
            configureInstance: true,
            skipUbii: false,
            ...options
        };

        if (this.options.skipUbii) {
            this.start();
            return;
        }

        UbiiClientService.instance.on(UbiiClientService.EVENTS.CONNECT, () => {
            this.start();
        });

        if (this.options.configureInstance) {
            UbiiClientService.instance.setHTTPS(
                window.location.protocol.includes('https')
            );
            UbiiClientService.instance.setName('Physical Embodiment Evaluation');
        }

        UbiiClientService.instance.connect(this.options.urlServices, this.options.urlTopicData);
    }

    /**
     * This function is called from the constructor after the connection to
     * the Ubi Interact master node is established.
     */
    private async start() {
        if (this.started) {
            return;
        }
        this.started = true;

        await this.createUbiiSpecs();

        if(
            !this.ubiiDevice ||
            !this.ubiiComponentA ||
            !this.ubiiComponentB
        ) {
            return;
        }

        if (!this.options.skipUbii) {
            const replyRegisterDevice = await UbiiClientService.instance.registerDevice(this.ubiiDevice);

            if (replyRegisterDevice.id) {
                this.ubiiDevice = replyRegisterDevice;
            } else {
                console.error(
                    'Device registration failed. Ubi Interact replied with:',
                    replyRegisterDevice
                );
                return;
            }

            await UbiiClientService.instance.subscribeTopic(
                this.ubiiComponentA.topic,
                (v: ProtobufLibrary.ubii.dataStructure.IObject3DList) => this.onAReceived(v)
            );

            await UbiiClientService.instance.subscribeTopic(
                this.ubiiComponentB.topic,
                (v: ProtobufLibrary.ubii.dataStructure.IObject3DList) => this.onBReceived(v)
            );
        }
    }

    /**
     * Private callback that is called when topic A has new data
     * @param data object3DList from the topic A publisher component
     */
    private onAReceived(data: ProtobufLibrary.ubii.dataStructure.IObject3DList) {
        console.log('A RECEIVED');
        this.logA.push({
            timestamp: new Date(),
            data
        });
    }

    /**
     * Private callback that is called when topic B has new data
     * @param data object3DList from the topic B publisher component
     */
    private onBReceived(data: ProtobufLibrary.ubii.dataStructure.IObject3DList) {
        console.log('B RECEIVED');
        const b = {
            timestamp: new Date(),
            data
        };
        this.logB.push(b);
        
        const a = this.logA.at(-1);

        this.options.onNewData({
            timestampA: a?.timestamp,
            timestampB: b.timestamp,
            A: a?.data.elements || [],
            B: b?.data.elements || []
        });
    }
    /**
     * Sets {ubiiDevice} and all components: {ubiiComponentA} and
     * {ubiiComponentB}
     */
    private async createUbiiSpecs() {
        const clientId = UbiiClientService.instance.getClientID();
        const deviceName = 'web-forces-applier';

        const topicA = await this.getPublisherComponentTopic(this.options.topicATags);
        const topicB = await this.getPublisherComponentTopic(this.options.topicBTags);

        this.ubiiDevice = {
            clientId,
            name: deviceName,
            deviceType: ProtobufLibrary.ubii.devices.Device.DeviceType.PARTICIPANT,
            components: [
                {
                    name: 'Topic A',
                    ioType: ProtobufLibrary.ubii.devices.Component.IOType.SUBSCRIBER,
                    topic: topicA,
                    messageFormat: 'ubii.dataStructure.Object3DList',
                },
                {
                    name: 'Topic B',
                    ioType: ProtobufLibrary.ubii.devices.Component.IOType.SUBSCRIBER,
                    topic: topicB,
                    messageFormat: 'ubii.dataStructure.Object3DList',
                }
            ],
        };

        [
            this.ubiiComponentA,
            this.ubiiComponentB,
        ]
            = this.ubiiDevice.components || [];
    }

    /**
     * Returns a topic that a component with given tags uses to publish data in the
     * object3DList format
     * @param tags subset of all tags of the existing publisher component
     * @returns 
     */
    private async getPublisherComponentTopic(tags: string[]): Promise<string> {
        const serviceRequestIkTargets = {
            topic: '/services/component/get_list',
            componentList: {
                elements: [{
                    ioType: ProtobufLibrary.ubii.devices.Component.IOType.PUBLISHER,
                    messageFormat: 'ubii.dataStructure.Object3DList',
                    tags
                }]
            }
        };

        const componentList = this.options.skipUbii ?
            'none' :
            (await UbiiClientService.instance.callService(
                serviceRequestIkTargets
            ));
        
        if(!(componentList?.componentList?.elements?.length)) {
            throw new Error(`No component with tags [${tags.map(t => `"${t}"`).join(', ')}] found`);
        }
            
        return componentList.componentList.elements[0].topic;
    }
    
    /**
     * Disconnects Ubi Interact and prints all evaluation results to console
     */
    stop() {
        if(!this.options.skipUbii) {
            UbiiClientService.instance.disconnect();
        }

        console.log(JSON.stringify({
            A: this.logA,
            B: this.logB
        }));
    }
}