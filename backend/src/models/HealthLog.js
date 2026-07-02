const mongoose = require('mongoose');

const HealthLogSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    symptoms: [
      {
        type: String,
        enum: [
          'fever',
          'headache',
          'fatigue',
          'cough',
          'sore-throat',
          'runny-nose',
          'shortness-of-breath',
          'chest-pain',
          'nausea',
          'vomiting',
          'diarrhea',
          'muscle-pain',
          'joint-pain',
          'rash',
          'dizziness',
          'loss-of-taste',
          'loss-of-smell',
          'other',
        ],
      },
    ],
    medications: [
      {
        medication: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Medication',
        },
        taken: {
          type: Boolean,
          default: false,
        },
        time: String,
        notes: String,
      },
    ],
    vitals: {
      bloodPressureSystolic: {
        type: Number,
        min: 50,
        max: 300,
      },
      bloodPressureDiastolic: {
        type: Number,
        min: 30,
        max: 200,
      },
      heartRate: {
        type: Number,
        min: 30,
        max: 220,
      },
      temperature: {
        type: Number,
        min: 30,
        max: 45,
      },
      weight: {
        type: Number,
        min: 1,
        max: 500,
      },
      height: {
        type: Number,
        min: 50,
        max: 300,
      },
      bmi: Number,
      bloodSugar: {
        type: Number,
        min: 20,
        max: 500,
      },
      oxygenSaturation: {
        type: Number,
        min: 70,
        max: 100,
      },
      respiratoryRate: {
        type: Number,
        min: 5,
        max: 50,
      },
    },
    mood: {
      type: String,
      enum: ['happy', 'neutral', 'sad', 'anxious', 'stressed', 'energetic', 'tired', 'depressed'],
    },
    sleep: {
      hours: {
        type: Number,
        min: 0,
        max: 24,
      },
      quality: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'very-poor'],
      },
      disturbances: {
        type: Number,
        min: 0,
        max: 20,
      },
      bedtime: String,
      wakeTime: String,
    },
    exercise: {
      type: {
        type: String,
        enum: ['cardiovascular', 'strength', 'flexibility', 'balance', 'none'],
      },
      duration: {
        type: Number,
        min: 0,
        max: 180,
      },
      intensity: {
        type: String,
        enum: ['light', 'moderate', 'intense'],
      },
      caloriesBurned: Number,
    },
    diet: {
      meals: {
        breakfast: {
          eaten: Boolean,
          description: String,
          time: String,
        },
        lunch: {
          eaten: Boolean,
          description: String,
          time: String,
        },
        dinner: {
          eaten: Boolean,
          description: String,
          time: String,
        },
        snacks: [
          {
            description: String,
            time: String,
          },
        ],
      },
      waterIntake: {
        type: Number,
        min: 0,
        max: 10,
        comment: 'In liters',
      },
      caffeineIntake: {
        type: Number,
        comment: 'In mg',
      },
      alcoholConsumed: {
        type: Boolean,
        default: false,
      },
      smoking: {
        type: Boolean,
        default: false,
      },
    },
    painLevel: {
      type: Number,
      min: 0,
      max: 10,
    },
    painLocation: [String],
    stressLevel: {
      type: Number,
      min: 0,
      max: 10,
    },
    energyLevel: {
      type: Number,
      min: 0,
      max: 10,
    },
    notes: String,
    followUpNeeded: {
      type: Boolean,
      default: false,
    },
    followUpNotes: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
HealthLogSchema.index({ patient: 1, date: -1 });
HealthLogSchema.index({ 'vitals.bloodSugar': 1 });

// Virtuals
HealthLogSchema.virtual('isHighRisk').get(function () {
  if (!this.vitals) return false;
  const { bloodPressureSystolic, bloodPressureDiastolic, heartRate, temperature } = this.vitals;
  return (
    bloodPressureSystolic > 180 ||
    bloodPressureDiastolic > 120 ||
    heartRate > 120 ||
    heartRate < 40 ||
    temperature > 39 ||
    temperature < 35
  );
});

HealthLogSchema.virtual('summary').get(function () {
  return {
    mood: this.mood || 'Not recorded',
    sleep: this.sleep ? `${this.sleep.hours || 0} hours` : 'Not recorded',
    water: this.diet ? `${this.diet.waterIntake || 0}L` : 'Not recorded',
    exercise: this.exercise ? `${this.exercise.duration || 0} min` : 'None',
  };
});

module.exports = mongoose.model('HealthLog', HealthLogSchema);