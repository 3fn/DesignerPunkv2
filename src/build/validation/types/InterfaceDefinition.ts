/**
 * Interface Definition Types
 * 
 * Defines the structure for component interface definitions
 * used in cross-platform validation.
 */

export interface InterfaceDefinition {
  /** Component name */
  name: string;
  
  /** Component description */
  description?: string;
  
  /** Property definitions */
  properties: PropertyDefinition[];
  
  /** Method signatures */
  methods: MethodSignature[];
  
  /** Event definitions */
  events: EventDefinition[];
  
  /** State definitions */
  states: StateDefinition[];
  
  /** Platform this interface is for */
  platform: Platform;
}

export interface PropertyDefinition {
  /** Property name */
  name: string;
  
  /** Property type */
  type: string;
  
  /** Whether property is required */
  required: boolean;
  
  /** Default value if any */
  defaultValue?: unknown;
  
  /** Property description */
  description?: string;
}

export interface MethodSignature {
  /** Method name */
  name: string;
  
  /** Method parameters */
  parameters: ParameterDefinition[];
  
  /** Return type */
  returnType: string;
  
  /** Method description */
  description?: string;
}

export interface ParameterDefinition {
  /** Parameter name */
  name: string;
  
  /** Parameter type */
  type: string;
  
  /** Whether parameter is required */
  required: boolean;
  
  /** Default value if any */
  defaultValue?: unknown;
}

export interface EventDefinition {
  /** Event name */
  name: string;
  
  /** Event payload type */
  payloadType?: string;
  
  /** Event description */
  description?: string;
}

export interface StateDefinition {
  /** State name */
  name: string;
  
  /** State type */
  type: string;
  
  /** Initial value */
  initialValue?: unknown;
  
  /** State description */
  description?: string;
}

export type Platform = 'ios' | 'android' | 'web';
