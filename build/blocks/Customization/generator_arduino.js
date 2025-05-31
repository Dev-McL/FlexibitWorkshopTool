/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for blocks that controls flexibit that conneted to board pin 9.
 */
"use strict";

goog.provide("Blockly.Arduino.Customize9");
goog.require("Blockly.Arduino.servo");
goog.require("Blockly.Arduino");

var setUpServoControlClass = `
#include <Servo.h>
#define MAX_SEQUENCES 10
#define QUEUE_SIZE 50
// target angle with speed or
struct Target
{
    int angle;
    int duration;  // Duration to reach the target angle
    int speed;     // millisec per degree step
    bool useSpeed; // Flag to indicate whether to use speed or duration
};

// sequence of target angle & speed/time
struct Sequence
{
    int front;          // start of the sequence in the queue
    int rear;           // end of the sequence in the queue
    int remainingSteps; // steps left to execute
    int maxRepeats;
    int totalSteps; // total steps in the sequence
};

class ServoController
{
    Servo servo;
    Target queue[QUEUE_SIZE];
    Sequence sequences[MAX_SEQUENCES];
    int currentSequenceIndex; // index of the current sequence being executed
    int sequenceCount;
    int repeatCount; // current repetition count for the current sequence
    unsigned long lastUpdate;
    unsigned long durationStartTime;
    int pos;

public:
    ServoController() : currentSequenceIndex(0), sequenceCount(0), repeatCount(0), lastUpdate(0), durationStartTime(0), pos(0)
    {
        for (int i = 0; i < MAX_SEQUENCES; i++)
        {
            sequences[i] = {0, 0, 0, 0, 0};
        }
    }

    void Attach(int pin)
    {
        servo.attach(pin);
        servo.write(0); // Initialize servo position
    }

    void Update()
    {
        if (currentSequenceIndex < sequenceCount && sequences[currentSequenceIndex].remainingSteps > 0)
        {
            Sequence &amp;sequence = sequences[currentSequenceIndex];
            Target &amp;currentTarget = queue[sequence.front];
            unsigned long currentMillis = millis();

            // if setting the speed, then checking time with speed (AKA mills/degree)
            if (currentTarget.useSpeed)
            {
                if (currentMillis - lastUpdate >= currentTarget.speed)
                {
                    // if time exceeded -> update to next degree
                    lastUpdate = currentMillis;
                    if (currentTarget.angle > pos)
                    {
                        pos++;
                    }
                    else if (currentTarget.angle < pos)
                    {
                        pos--;
                    }
                    servo.write(pos);

                    if (pos == currentTarget.angle)
                    {
                        sequence.front = (sequence.front + 1) % QUEUE_SIZE;
                        sequence.remainingSteps--;
                    }
                }
            }
            else
            {
                // Calculate the target position based on duration
                unsigned long elapsedTime = currentMillis - durationStartTime;

                if (elapsedTime >= currentTarget.duration)
                {
                    // if time exceeded -> go to next target struct
                    durationStartTime = currentMillis;
                    pos = currentTarget.angle;
                    servo.write(pos);
                    sequence.front = (sequence.front + 1) % QUEUE_SIZE;
                    sequence.remainingSteps--;
                }
                else
                {
                    // using fraction to record the program of angle
                    float curAngleFraction = (float)elapsedTime / currentTarget.duration;
                    int targetPos = pos + (currentTarget.angle - pos) * curAngleFraction;
                    servo.write(targetPos);
                }
            }

            // Comment out for now, for debuging
            // Serial.print("currentMillis: ");
            // Serial.print(currentMillis);
            // Serial.print(", pos: ");
            // Serial.print(pos);
            // Serial.print(", target angle: ");
            // Serial.print(currentTarget.angle);
            // Serial.print(", remainingSteps: ");
            // Serial.println(sequence.remainingSteps);

            if (sequence.remainingSteps == 0)
            {
                // Sequence completed
                repeatCount++;
                if (repeatCount < sequence.maxRepeats)
                {
                    ResetSequence(currentSequenceIndex); // repeat the sequence
                }
                else if (currentSequenceIndex < sequenceCount - 1)
                {
                    // increment to next sequence
                    currentSequenceIndex++;
                    repeatCount = 0;
                    ResetSequence(currentSequenceIndex);
                }
                else
                {
                    servo.detach();
                    Serial.print(millis()); // check if actual time used is lying
                }
            }
        }
    }

    // initial a new queue for sequence
    void StartNewSequence()
    {
        if (sequenceCount < MAX_SEQUENCES)
        {
            if (sequenceCount == 0)
            {
                sequences[sequenceCount].front = 0;
            }
            else
            {
                sequences[sequenceCount].front = sequences[sequenceCount - 1].rear + 1;
            }
            sequences[sequenceCount].rear = sequences[sequenceCount].front - 1; // Initialize rear to be one before front
            sequences[sequenceCount].remainingSteps = 0;
            sequences[sequenceCount].totalSteps = 0;
            sequenceCount++;
        }
    }

    // helper to set num of time a sequence repeat
    void SetRepeats(int repeats)
    {
        if (sequenceCount == 0)
            return;                            // if No sequence started
        int sequenceIndex = sequenceCount - 1; // Current sequence index
        if (sequenceIndex >= MAX_SEQUENCES)
            return;
        sequences[sequenceIndex].maxRepeats = repeats;
    }

    // repeat a SEQUENCE
    void ResetSequence(int sequenceIndex)
    {
        Sequence &amp;sequence = sequences[sequenceIndex];
        sequence.front = (sequence.rear - sequence.totalSteps + QUEUE_SIZE + 1) % QUEUE_SIZE;
        sequence.remainingSteps = sequence.totalSteps;
        durationStartTime = millis(); // Reset duration start time for the new sequence
    }

    // set angle, and time move to that angle
    void setAngleDuration(int targetAngle, int duration)
    {
        addTargetToSequence(targetAngle, duration, 0, false);
    }

    // set angle and speed move to that angle
    void setAngleSpeed(int targetAngle, int userSpeed)
    {
        int mappedSpeed = map(userSpeed, 1, 10, 50, 5);
        addTargetToSequence(targetAngle, 0, mappedSpeed, true);
    }

    // cannot use pos
    // because pos is only updated when Update() is called in loop(),
    // however this function is called in setUp()
    // for a new sequence : rear is = front -1
    void addDelayDuration(int duration)
    {
        int sequenceIndex = sequenceCount - 1; // Current sequence index
        Sequence curSequence = sequences[sequenceIndex];
        // angle of last target or pos  (0) if rear is negative
        int lastPos = (curSequence.rear >= 0) ? queue[curSequence.rear].angle : pos;

        Serial.print(" lastPos: ");
        Serial.println(lastPos);
        addTargetToSequence(lastPos, duration, 0, false);
    }

    // helper function to add Target (angle , speed or duration )to the sequence
private:
    void addTargetToSequence(int targetAngle, int duration, int speed, bool useSpeed)
    {
        if (sequenceCount == 0)
            return;                            // No sequence started
        int sequenceIndex = sequenceCount - 1; // Current sequence index

        Sequence &amp;sequence = sequences[sequenceIndex];

        sequence.rear = (sequence.rear + 1) % QUEUE_SIZE;                // Increment rear pointer
        queue[sequence.rear] = {targetAngle, duration, speed, useSpeed}; // Set angle, duration, and speed
        sequence.totalSteps++;
        sequence.remainingSteps = sequence.totalSteps; // Initialize remaining steps for the new sequence

        // Debug prints
        // Serial.print("Added Target Angle: ");
        // Serial.print(targetAngle);
        // if (useSpeed) {
        //   Serial.print(" Speed: ");
        //   Serial.println(speed);
        // } else {
        //   Serial.print(" Duration: ");
        //   Serial.println(duration);
        // }
    }
};
`;

// angle + speed block
Blockly.Arduino["set_servo_angle_speed"] = function (block) {

  var angle = Blockly.Arduino.valueToCode(block, 'ANGLE', Blockly.Arduino.ORDER_ATOMIC);
  var speed = Blockly.Arduino.valueToCode(block, 'SPEED', Blockly.Arduino.ORDER_ATOMIC);

  var code = 'servo___SERVO_PIN__.setAngleSpeed(' + angle + ', ' + speed + '); \n';
  return code;
};


Blockly.Arduino["set_servo_angle_time"] = function (block) {

  var angle = Blockly.Arduino.valueToCode(block, 'ANGLE', Blockly.Arduino.ORDER_ATOMIC);
  var userTime = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC);

  var time = userTime * 1000;

  var code = 'servo___SERVO_PIN__.setAngleDuration(' + angle + ', ' + time + '); \n';
  return code;
};


Blockly.Arduino['start_sequence_repeat'] = function (block) {
  var number_repeats = Blockly.Arduino.valueToCode(block, 'REPEATS', Blockly.Arduino.ORDER_ATOMIC);
  var statements_do = Blockly.Arduino.statementToCode(block, 'DO');
  var code = 'servo___SERVO_PIN__.StartNewSequence();\n';
  code += statements_do;

  code += '   servo___SERVO_PIN__.SetRepeats(' + number_repeats + ');\n';
  return code;
};



// wrapper for multiple servo control
Blockly.Arduino['multi_servo_control'] = function (block) {
  var statements_flexibit1 = Blockly.Arduino.statementToCode(block, 'FB1');
  var statements_flexibit2 = Blockly.Arduino.statementToCode(block, 'FB2');
  var statements_flexibit3 = Blockly.Arduino.statementToCode(block, 'FB3');

  Blockly.Arduino.definitions_['setUpServoControlClass'] = setUpServoControlClass;

  Blockly.Arduino.definitions_['servo_9'] = 'ServoController servo_9;';
  Blockly.Arduino.definitions_['servo_10'] = 'ServoController servo_10;';
  Blockly.Arduino.definitions_['servo_11'] = 'ServoController servo_11;';

  Blockly.Arduino.setups_['serial_setup'] = 'Serial.begin(9600);';
  Blockly.Arduino.setups_['setup_servo_9'] = 'servo_9.Attach(9);';
  Blockly.Arduino.setups_['setup_servo_10'] = 'servo_10.Attach(10);';
  Blockly.Arduino.setups_['setup_servo_11'] = 'servo_11.Attach(11);';

  Blockly.Arduino.setups_['sevo_9_behabior'] = statements_flexibit1.replace(/__SERVO_PIN__/g, '9');
  Blockly.Arduino.setups_['sevo_10_behabior'] = statements_flexibit2.replace(/__SERVO_PIN__/g, '10');
  Blockly.Arduino.setups_['sevo_11_behabior'] = statements_flexibit3.replace(/__SERVO_PIN__/g, '11');
  // need to change into only the block that is attached can be genreated by update
  var code = `
    servo_9.Update();
    servo_10.Update();
    servo_11.Update();
  `;
  return code;
};

Blockly.Arduino['single_cuddlebit_control'] = function(block) {
  var statements_behaviors = Blockly.Arduino.statementToCode(block, 'BEHAVIORS');

  Blockly.Arduino.definitions_['setUpServoControlClass'] = setUpServoControlClass;
  Blockly.Arduino.definitions_['servo_9'] = 'ServoController servo_9;';
  Blockly.Arduino.setups_['serial_setup'] = 'Serial.begin(9600);';
  Blockly.Arduino.setups_['setup_servo_9'] = 'servo_9.Attach(9);';
  
  // <-- INSERT THE MISSING PIECE HERE:
  Blockly.Arduino.setups_['setup_servo_9_sequence'] = 'servo_9.StartNewSequence();';

  // Then apply the behaviors (with proper pin replacements if needed)
  Blockly.Arduino.setups_['servo_9_behavior'] = statements_behaviors.replace(/__SERVO_PIN__/g, '9');

  var code = `
    servo_9.Update();
  `;
  return code;
};











