import ProtobufLibrary from '@tum-far/ubii-msg-formats/dist/js/protobuf';
import { EvaluatorOptions } from './EvaluatorOptions';
export interface TopicLog {
    timestamp: Date;
    data: ProtobufLibrary.ubii.dataStructure.IObject3DList;
}
/**
 * Main class of the evaluation module. Instantiating this class will
 * set up everything that is necessary to log object3D lists from two
 * topics. The complete result is printed when calling {stop}, otherwise
 * to use data it can be obtained using the onNewData option.
 */
export declare class Evaluator {
    started: boolean;
    ubiiDevice?: Partial<ProtobufLibrary.ubii.devices.Device>;
    ubiiComponentA?: ProtobufLibrary.ubii.devices.IComponent;
    ubiiComponentB?: ProtobufLibrary.ubii.devices.IComponent;
    logA: TopicLog[];
    logB: TopicLog[];
    options: EvaluatorOptions;
    /**
     * This creates the evaluator, which then automatically connects to
     * the Ubi Interact master node and starts sending, evaluating and
     * publishing information
     * @param options See {Evaluator} for documentation on the
     *   default values
     */
    constructor(options?: Partial<EvaluatorOptions>);
    /**
     * This function is called from the constructor after the connection to
     * the Ubi Interact master node is established.
     */
    private start;
    /**
     * Private callback that is called when topic A has new data
     * @param data object3DList from the topic A publisher component
     */
    private onAReceived;
    /**
     * Private callback that is called when topic B has new data
     * @param data object3DList from the topic B publisher component
     */
    private onBReceived;
    /**
     * Sets {ubiiDevice} and all components: {ubiiComponentA} and
     * {ubiiComponentB}
     */
    private createUbiiSpecs;
    /**
     * Returns a topic that a component with given tags uses to publish data in the
     * object3DList format
     * @param tags subset of all tags of the existing publisher component
     * @returns
     */
    private getPublisherComponentTopic;
    /**
     * Disconnects Ubi Interact and prints all evaluation results to console
     */
    stop(): void;
}
