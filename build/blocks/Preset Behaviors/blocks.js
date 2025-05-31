/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Ardublockly JavaScript for the Blockly resources and bindings.
 * for blocks that controls flexibit that conneted to board pin 9
 */

goog.provide("Blockly.Constants.servo");

goog.require("Blockly.Blocks");
goog.require("Blockly.Types");
goog.require("Blockly");

// take the time of EACH breath, angle and number of cycle
Blockly.Blocks["breathing_preiod_angle_cycle"] = {
  init: function () {
    this.appendDummyInput().appendField("Breathe");

    this.setInputsInline(false);

    this.appendDummyInput().appendField(" ");

    this.appendValueInput("PERIOD")
      .appendField("Breath length (seconds):")
      .setCheck(Blockly.Types.NUMBER.checkList)
      .appendField("seconds");

    this.appendValueInput("DEGREE")
      .appendField("Breath depth (1 = shallow, 180 = deep):")
      .setCheck(Blockly.Types.NUMBER.checkList);

    this.appendValueInput("CYCLES")
      .appendField("Repeat how many times:")
      .setCheck(Blockly.Types.NUMBER.checkList)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput().appendField("times").setAlign(Blockly.ALIGN_RIGHT);

    this.setPreviousStatement(true, "Behavior"); // able to attech to a block before
    this.setNextStatement(true, "Behavior"); // able to attech a block after
    this.setTooltip(
      "Create a breathing motion by specifying length and depth of each breath, and number of breaths."
    );

  },
  onchange: function (event) {
    let invalidPeriod = false;
    let invalidAngle = false;
    let invalidCycles = false;
    let warnings = [];

    if (!this.workspace) {
      // Block has been deleted.
      return;
    }

    const periodBlock = this.getInputTargetBlock("PERIOD");
    const angleBlock = this.getInputTargetBlock("DEGREE");
    const cyclesBlock = this.getInputTargetBlock("CYCLES");

    if (periodBlock && periodBlock.type === "math_number") {
      const periodValue = parseFloat(periodBlock.getFieldValue("NUM"));
      if (periodValue <= 0 || isNaN(periodValue)) {
        invalidPeriod = true;
        warnings.push("Period must be greater than 0.");
      }
    }

    if (angleBlock && angleBlock.type === "math_number") {
      const angleValue = parseFloat(angleBlock.getFieldValue("NUM"));
      if (angleValue <= 0 || angleValue > 180 || isNaN(angleValue)) {
        invalidAngle = true;
        warnings.push("Degree must be between 0 and 180.");
      }
    }

    if (cyclesBlock && cyclesBlock.type === "math_number") {
      const cyclesValue = parseFloat(cyclesBlock.getFieldValue("NUM"));
      if (cyclesValue <= 0 || isNaN(cyclesValue)) {
        invalidCycles = true;
        warnings.push("Number of times must be greater than 0.");
      }
    }

    if (invalidPeriod || invalidAngle || invalidCycles) {
      this.setWarningText(warnings.join("\n"));
      if (typeof this.setDisabled === "function") {
        this.setDisabled(true);
      }
    } else {
      this.setWarningText(null);
      if (typeof this.setDisabled === "function") {
        this.setDisabled(false);
      }
    }
  },
};

// takes breathing number of cycle, angle, and preset speed
Blockly.Blocks["breathing_spd_angle_cycle"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Breathe")
      .appendField(
        new Blockly.FieldDropdown([
          ["slow", "SLOW"],
          ["fast", "FAST"],
        ]),
        "SPEED"
      );
    this.setInputsInline(false);
    this.appendDummyInput()
      .appendField("and")
      .appendField(
        new Blockly.FieldDropdown([
          ["deep", "DEEP"],
          ["shallow", "SHALLOW"],
        ]),
        "AMP"
      );
    this.setInputsInline(false);

    this.appendValueInput("CYCLES")
      .appendField("Repeat For")
      .setCheck(Blockly.Types.NUMBER.checkList);
    this.setInputsInline(true);
    this.appendDummyInput().appendField("times");

    this.setPreviousStatement(true, "Behavior");
    this.setNextStatement(true, "Behavior");
    this.setTooltip("Breathe a specified number of times.");
  },

  onchange: function (event) {

    if (!this.workspace) {
      // Block has been deleted.
      return;
    }

    const breathingCyclesBlock = this.getInputTargetBlock("CYCLES");

    if (breathingCyclesBlock && breathingCyclesBlock.type === "math_number") {
      const numRepeats = parseFloat(breathingCyclesBlock.getFieldValue("NUM"));
      if (numRepeats <= 0 || isNaN(numRepeats)) {
        this.setWarningText("Number of times must be greater than 0.");
        this.setDisabled(true);
      } else {
        this.setWarningText(null);
        this.setDisabled(false);
      }
    }
  },
};

// takes breathing number of cycle, angle, and userinput speed
Blockly.Blocks["breathing_interval_angle_cycle"] = {
  init: function () {
    this.appendDummyInput().appendField("Breathe");

    this.setInputsInline(false);

    this.appendDummyInput().appendField(" ");

    this.appendValueInput("INTERVAL")
      .appendField("Speed (1 = slow, 10 = fast): ")
      .setCheck(Blockly.Types.NUMBER.checkList);

    this.appendValueInput("DEGREE")
      .appendField("Depth (1 = shallow, 180 = deep):")
      .setCheck(Blockly.Types.NUMBER.checkList);
    // this.setInputsInline(true);

    this.appendValueInput("CYCLES")
      .appendField("Repeat for")
      .setCheck(Blockly.Types.NUMBER.checkList)

      .setAlign(Blockly.ALIGN_RIGHT);

    this.appendDummyInput().appendField("times").setAlign(Blockly.ALIGN_RIGHT);

    this.setPreviousStatement(true, "Behavior"); // able to attech to a block before
    this.setNextStatement(true, "Behavior"); // able to attech a block after
    this.setTooltip(
      "Create a breathing motion with a specified speed and depth of breath, and number of breaths."
    );
    // this.setHelpUrl();
  },

  onchange: function (event) {
    
    let invalidInterval = false;
    let invalidDepth = false;
    let invalidCycles = false;
    warnings = [];

    if (!this.workspace) {
      // Block has been deleted.
      return;
    }

    const customBreathingInterval = this.getInputTargetBlock("INTERVAL");
    const customBreathingDepth = this.getInputTargetBlock("DEGREE");
    const customBreathingCycle = this.getInputTargetBlock("CYCLES");

    if (
      customBreathingInterval &&
      customBreathingInterval.type === "math_number"
    ) {
      const numIntervals = parseFloat(
        customBreathingInterval.getFieldValue("NUM")
      );
      if (numIntervals < 1 || numIntervals > 10 || isNaN(numIntervals)) {
        invalidInterval = true;
        warnings.push("Speed must be between 1 and 10.");
      } 
    }

    if (customBreathingDepth && customBreathingDepth.type === "math_number") {
      const depth = parseFloat(customBreathingDepth.getFieldValue("NUM"));
      if (depth < 0 || depth > 180 || isNaN(depth)) {
        invalidDepth = true;
        warnings.push("Depth must be between 0 and 180 degrees.");
      }
    }

    if (customBreathingCycle && customBreathingCycle.type === "math_number") {
      const numCycles = parseFloat(customBreathingCycle.getFieldValue("NUM"));
      if (numCycles <= 0 || isNaN(numCycles)) {
        invalidCycles = true;
        warnings.push("Number of times must be greater than 0.");
      }
    }

    if (invalidInterval || invalidDepth || invalidCycles) {
      this.setWarningText(warnings.join("\n"));
      this.setDisabled(true);
    } else {
      this.setWarningText(null);
      this.setDisabled(false);
    }
  },
};

Blockly.Blocks["shake"] = {
  init: function () {
    this.appendDummyInput().appendField("Shake");

    this.input;
    this.appendValueInput("CYCLES")
      .appendField("Repeat how many times:")
      .setCheck(Blockly.Types.NUMBER.checkList)

      .setAlign(Blockly.ALIGN_RIGHT);

    this.appendDummyInput().appendField("times").setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true, "Behavior"); // able to attech to a block before
    this.setNextStatement(true, "Behavior"); // able to attech a block after
    this.setTooltip("Shake for a specified number of times.");
  },
  onchange: function (event) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }

    const shakeBlock = this.getInputTargetBlock("CYCLES");

    if (shakeBlock && shakeBlock.type === "math_number") {
      const numCycles = parseFloat(shakeBlock.getFieldValue("NUM"));
      if (numCycles < 1 || isNaN(numCycles)) {
        this.setWarningText("Number of times must be greater than 0.");
        this.setDisabled(true);
      } else {
        this.setWarningText(null);
        this.setDisabled(false);
      }
    }
  },
};

Blockly.Blocks["heartbeat"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Heartbeat")
      .appendField(
        new Blockly.FieldDropdown([
          ["Slow", "Slow"],
          ["Fast", "Fast"],
        ]),
        "heartrate"
      );
    this.setInputsInline(false);

    this.appendValueInput("DURATION")
      .appendField("Repeat for")
      .setCheck(Blockly.Types.NUMBER.checkList);
    this.setInputsInline(true);
    this.appendDummyInput().appendField("times");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Heartbeat for a specified number of times.");
  },

  onchange: function (event) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }

    const heartbeatBlock = this.getInputTargetBlock("DURATION");

    if (heartbeatBlock && heartbeatBlock.type === "math_number") {
      const duration = parseFloat(heartbeatBlock.getFieldValue("NUM"));
      if (duration < 1 || isNaN(duration)) {
        this.setWarningText("Number of times must be greater than 0.");
        this.setDisabled(true);
      } else {
        this.setWarningText(null);
        this.setDisabled(false);
      }
    }
  },
};
