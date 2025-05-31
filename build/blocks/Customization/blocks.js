/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Ardublockly JavaScript for the Blockly resources and bindings.
 * for blocks that controls flexibit that connected to board pin 9
 */

goog.require("Blockly.Constants.servo");
goog.require("Blockly.Blocks");
goog.require("Blockly.Types");
goog.require("Blockly");

Blockly.Blocks["set_servo_angle_speed"] = {
  init: function () {
    this.appendDummyInput().appendField("Move Cuddlebit (by speed):");
    this.appendValueInput("ANGLE")
      .setCheck(Blockly.Types.NUMBER.checkList)
      .appendField("Angle (0-180):");
    this.appendValueInput("SPEED")
      .setCheck(Blockly.Types.NUMBER.checkList)
      .appendField("Speed (1 = slow, 10 = fast):");

    this.setPreviousStatement(true, "Custom");
    this.setNextStatement(true, "Custom");
    this.setColour(120);
    this.setTooltip(
      "Create a behavior by specifying the target angle and movement speed."
    );
    this.setHelpUrl("");
  },
  onchange: function (event) {
    let invalidAngle = false;
    let invalidSpeed = false;
    let warnings = [];

    if (!this.workspace) {
      // Block has been deleted.
      return;
    }

    const angleBlock = this.getInputTargetBlock("ANGLE");
    const speedBlock = this.getInputTargetBlock("SPEED");

    if (angleBlock && angleBlock.type === "math_number") {
      const angleValue = parseFloat(angleBlock.getFieldValue("NUM"));
    
      if (isNaN(angleValue) || angleValue < 0 || angleValue > 180) {
        warnings.push("Angle must be between 0 and 180 degrees.");
        invalidAngle = true;
      }
    }
    
    if (speedBlock && speedBlock.type === "math_number") {
      const speedValue = parseFloat(speedBlock.getFieldValue("NUM"));
      if (isNaN(speedValue) || speedValue < 1 || speedValue > 10) {
        warnings.push("Speed must be between 1 and 10.");
        invalidSpeed = true;
      }
    }
    
    // Set warning text and disabled state based on both conditions
    if (invalidAngle || invalidSpeed) {
      this.setWarningText(warnings.join("\n"));
      if (typeof this.setDisabled === 'function') {
        this.setDisabled(true);
      } 
    } else {
      this.setWarningText(null);
      if (typeof this.setDisabled === 'function') {
        this.setDisabled(false);
      } 
    }
  }
};

Blockly.Blocks["set_servo_angle_time"] = {
  init: function () {
    this.appendDummyInput().appendField("Move Cuddlebit (by time):");
    this.appendValueInput("ANGLE")
      .setCheck(Blockly.Types.NUMBER.checkList)
      .appendField("Angle (0-180):");
    this.appendValueInput("TIME")
      .setCheck(Blockly.Types.NUMBER.checkList)
      .appendField("Time (seconds): ");
    this.setPreviousStatement(true, "Custom");
    this.setNextStatement(true, "Custom");
    this.setColour(120);
    this.setTooltip(
      "Create a behavior by specifying the target angle and movement time in seconds."
    );
    this.setHelpUrl("");
  },
  onchange: function (event) {
    let invalidAngle = false;
    let invalidTime = false;
    let warnings = [];

    if (!this.workspace) {
      // Block has been deleted.
      return;
    }

    const angleBlock = this.getInputTargetBlock("ANGLE");
    const timeBlock = this.getInputTargetBlock("TIME");

    if (angleBlock && angleBlock.type === "math_number") {
      const angleValue = parseFloat(angleBlock.getFieldValue("NUM"));
    
      if (isNaN(angleValue) || angleValue < 0 || angleValue > 180) {
        warnings.push("Angle must be between 0 and 180 degrees.");
        invalidAngle = true;
      }
    }

    if (timeBlock && timeBlock.type === "math_number") {
      const timeValue = parseFloat(timeBlock.getFieldValue("NUM"));
      if (timeValue <= 0 || isNaN(timeValue)) {
        warnings.push("Time must be a positive number.");
        invalidTime = true;
    }
  }
    // Set warning text and disabled state based on both conditions
    if (invalidAngle || invalidTime) {
      this.setWarningText(warnings.join("\n"));
      if (typeof this.setDisabled === 'function') {
        this.setDisabled(true);
      } 
    } else {
      this.setWarningText(null);
      if (typeof this.setDisabled === 'function') {
        this.setDisabled(false);
      } 
    }
  }
};

Blockly.Blocks["start_sequence_repeat"] = {
  init: function () {
    this.appendDummyInput().appendField("Custom Behavior: ");
    this.appendStatementInput("DO").setCheck("Custom").appendField("DO");
    this.appendValueInput("REPEATS")
      .setCheck(Blockly.Types.NUMBER.checkList)
      .appendField("repeat for");
    this.setPreviousStatement(true, "Behavior");
    this.setNextStatement(true, "Behavior");
    this.setTooltip(
      "Create a sequence of behaviors that will repeat a specific number of times."
    );
    this.setHelpUrl("");
  },

  onchange: function (event) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }

    const sequenceBlock = this.getInputTargetBlock("REPEATS");

    if (sequenceBlock && sequenceBlock.type === "math_number") {
      const numRepeats = parseFloat(sequenceBlock.getFieldValue("NUM"));
      if (numRepeats <= 0 || isNaN(numRepeats)) {
        this.setWarningText("Sequence must be a positive number.");
        this.setDisabled(true);
      } else {
        this.setWarningText(null);
        this.setDisabled(false);
      }
    }
  },
};

Blockly.Blocks["multi_servo_control"] = {
  init: function () {
    this.appendDummyInput().appendField("Multi Cuddlebit Control");

    this.appendStatementInput("FB1")
      .setCheck("Behavior")
      .appendField("Cuddlebit 1");

    this.appendStatementInput("FB2")
      .setCheck("Behavior")
      .appendField("Cuddlebit 2");

    this.appendStatementInput("FB3")
      .setCheck("Behavior")
      .appendField("Cuddlebit 3");

    this.setColour(230);
    this.setTooltip(
      "Control multiple servos with separate blocks for each servo."
    );
    this.setHelpUrl("");
  },
};

Blockly.Blocks["single_cuddlebit_control"] = {
  init: function () {
    this.appendDummyInput().appendField("Single Cuddlebit Control");
    this.appendStatementInput("BEHAVIORS")
        .setCheck("Behavior")
        .appendField("Cuddlebit Behaviors:");
    this.setColour(120);
    this.setTooltip("Control a single Cuddlebit using behaviors.");
    this.setHelpUrl("");
  }
};


