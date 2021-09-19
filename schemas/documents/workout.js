import React from 'react'

import workoutTimeCalculator from '../../src/workoutTimeCalculator'
import Tile from '../../static/Tile'

export default {
  name: 'workout',
  titlte: 'Workout',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'type',
      title: 'Workout Type',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          {title: 'Part of Program', value: 'program'},
          {title: 'One-Off', value: 'oneOff'}
        ],
        layout: 'radio'
      }
    },
    {
      name: 'programDay',
      title: 'Program Day',
      type: 'object',
      hidden: ({ document}) => document.type !== 'program',
      options: {
        columns: 2
      },
      fields: [
        {
          name: 'week',
          title: 'Week',
          type: 'number',
        },
        {
          name: 'day',
          title: 'Day',
          type: 'string',
          options: {
            list: [
              {title: 'Monday', value: 'monday'},
              {title: 'Tuesday', value: 'tuesday'},
              {title: 'Wednesday', value: 'wednesday'},
              {title: 'Thursday', value: 'thursday'},
              {title: 'Friday', value: 'friday'},
              {title: 'Saturday', value: 'saturday'},
              {title: 'Sunday', value: 'sunday'},
            ]
          }
        },
      ]
    },
    {
      name: 'date',
      title: 'Date',
      description: '(Optional)',
      type: 'date',
      hidden: ({ document}) => document.type !== 'oneOff',
      options: {
        dateFormat: 'MM-DD-YY'
      }
    },
    {
      title: 'Focus',
      description: 'Select the type of muscle building this workout focuses on',
      name: 'focus',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          {title: 'Hypertrophy', value: 'hypertrophy'},
          {title: 'Strength', value: 'strength'}
        ],
        layout: 'radio'

      }
    },
    {
      name: 'target',
      title: 'Target Muscle Group(s)',
      description: 'Select the muscle groups this workout targets.',
      type: 'array',
      of: [ 
        { type: 'reference',
          to: [
            { type: 'target' }
          ],
          options: {
            filter: ({ document }) => {
              const existingTargets = document.target.map(target => target._ref).filter(Boolean)

              return {
                filter: '!(_id in $existingTargets)',
                params: {
                  existingTargets
                }
              }
            }
          }
        }
      ],
    },
    {
      name: 'equipment',
      title: 'Equipment',
      description: 'Select the equipment you need for these exercises.',
      type: 'array',
      of: [ 
        { type: 'reference',
          to: [
            { type: 'equipment' }
          ],
          options: {
            filter: ({ document }) => {
              const existingEquipment = document.equipment.map(equipment => equipment._ref).filter(Boolean)
              return {
                filter: '!(_id in $existingEquipment)',
                params: {
                  existingEquipment
                }
              }
            }
          }
        }
      ],
    },
    {
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      of: [
        { type: 'exerciseComponent'}
      ]
    },
    {
      name: 'workoutLength',
      title: 'Workout Length',
      type: 'number',
      inputComponent: workoutTimeCalculator
    }
  ],
  preview: {
    select: {
      title: 'title',
      target0: 'target.0.name',
      target1: 'target.1.name',
      target2: 'target.2.name',
      workoutLength: 'workoutLength'
    },

    prepare({ title, target0, target1, target2, workoutLength }){
      const targets = [target0, target1].filter(Boolean)
      const subtitle = `${targets.length > 0 ? targets.join(', ') : ''}
                        ${target2 ? '...' : ''}
                        ${targets.length > 0 && workoutLength ? ' | ' : ''}
                        ${workoutLength ? `${workoutLength} min${workoutLength > 1 ? 's' : ''}` : ''}`

      return {
        title: title ? title : '',  
        subtitle: subtitle ? subtitle : '',
        media: <Tile equipment='workout' />
      }
    }
  },
  orderings: [
    {
      title: 'Release Date',
      name: 'dateAsc',
      by: [
        {field: 'date', direction: 'asc'}
      ]
    },
  ]
}