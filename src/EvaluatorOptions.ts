import ProtobufLibrary from '@tum-far/ubii-msg-formats/dist/js/protobuf';

/**
 * Options for the Ubi-Interact IK and force estimation processing module.
 * All Parameters are optional in the constructor, the default values of
 * the publisher allow connections to a master node at localhost with a
 * configuration made for the process of physical embodiment in VR.
 * In simple usage scenarios, it is not necessary to supply any options.
 * Debugging can be simplified by using {skipUbii} as well as the
 * callbacks {onTargetsReceived}, {onPoseComputed} and
 * {onVelocitiesPublished}.
 */
export interface EvaluatorOptions {

    /**
     * The URL for the Ubi Interact services endpoint. Defaults to
     * 'http://localhost:8102/services' if not set. Value has no impact
     * when {skipUbii} is true.
     */
    urlServices: string;

    /**
     * The URL for the Ubi Interact topic data endpoint. Defaults to
     * 'ws://localhost:8104/topicdata' if not set. Value has no impact
     * when {skipUbii} is true.
     */
    urlTopicData: string;

    /**
     * The tags that the publishing component of topic A has. Topic A will
     * be interpreted as the first one in all time differences.
     */
    topicATags: string[];

    /**
     * The tags that the publishing component of topic B has. Topic B will
     * be interpreted as the second one in all time differences.
     */
    topicBTags: string[];

    /**
     * Function that receives the data each time that topic B is
     * received. Because of this, data from topic A might be incomplete
     * and should, if necessary, be read directly from the evaluator.
     */
    onNewData: (data: Evaluation) => void;

    
    /**
     * Ubii needs to be configured with data such as a name, ... once.
     * If Ubi Interact is already configured by another module, this option
     * can be set to false. Defaults to true when not set.
     */
    configureInstance: boolean;

    /**
     * Determines whether data should be sent to and received from an
     * master node. Can be set to true for debugging purposes: in that
     * case, no master node would be required, but all other
     * functionality, such as the {onTargetPublished} function, would
     * still work. Defaults to false if not set.
     */
    skipUbii: boolean;
}

export interface Evaluation {
    /**
     * The most recent time at which topic A was received
     */
    timestampA?: Date;

    /**
     * The most recent time at which topic B was received
     */
    timestampB: Date;

    /**
     * Content of the most recently received topic A. It might happen
     * that not all topic A data is returned if topic B is not received
     * in the same frequency. Evaluation data is being returned every time
     * that B is received.
     */
    A?: ProtobufLibrary.ubii.dataStructure.IObject3D[];

    /**
     * Content of the most recently received topic B. Every received topic
     * B data will be returned here at some point in time.
     */
    B: ProtobufLibrary.ubii.dataStructure.IObject3D[];
}