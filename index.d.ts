type Node = {
    top: Number
    left: Number
    module: String
    name: String
    run: String
    inputs?: {
        [name]: Boolean
    }
    outputs?: {
        [name]: Boolean
    }
    layer_id: Number
    style?: Object
}
