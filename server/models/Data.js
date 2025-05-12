import { Schema, model } from 'mongoose';

const dataSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    card: [{
        title: String,
        id: String,
        description: String,
        icon: String,
        navigation: String
    }],
    banner: [{
        title: String,
        id: String,
        description: String,
        icon: String,
        navigation: String
    }],
    plaque: [{
        title: String,
        id: String,
        description: String,
        icon: String,
        video: {
            type: Number,
            default: 0
        },
        navigation: String
    }],
    main_data: {
        fields: [{
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                required: true,
                trim: true
            },
            number_of_courses: {
                type: Number,
                default: 0,
                min: 0
            },
            courses: [{
                id: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true,
                    trim: true
                },
                description: {
                    type: String,
                    required: true,
                    trim: true
                },
                number_of_subjects: {
                    type: Number,
                    default: 0,
                    min: 0
                },
                subjects: [{
                    id: {
                        type: String,
                        required: true
                    },
                    name: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    description: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    playlist: [{
                        video_id: {
                            type: String,
                            required: true
                        }
                    }]
                }]
            }]
        }]
    }
}, {
    timestamps: true
});

// Only export the main data model
export default model('Data', dataSchema);