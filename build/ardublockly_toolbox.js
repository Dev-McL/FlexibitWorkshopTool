/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview XML toolbox embedded into a JavaScript text string.
 */
"use strict";

/** Create a namespace for the application. */
var Ardublockly = Ardublockly || {};

Ardublockly.TOOLBOX_XML =
    '<xml>' +
'<category id="Preset Behaviors" name="Preset Behaviors">' +
    '   <block type=\"multi_servo_control\">' +
    '   </block>' +


    '   <block type=\"breathing_spd_angle_cycle\">' +
    '      <value name="CYCLES">' +
    '        <block type="math_number">' +
    '          <field name="NUM">5</field>' +
    '        </block>' +
    '      </value>' +
    '   </block > ' +

    '   <block type="breathing_interval_angle_cycle">' +
    '      <value name="INTERVAL">' +
    '        <block type="math_number">' +
    '          <field name="NUM">5</field>' +
    '        </block>' +
    '      </value>' +
    '      <value name="DEGREE">' +
    '        <block type="math_number">' +
    '          <field name="NUM">90</field>' +
    '        </block>' +
    '      </value>' +
    '      <value name="CYCLES">' +
    '        <block type="math_number">' +
    '          <field name="NUM">5</field>' +
    '        </block>' +
    '      </value>' +
    '   </block > ' +

    ' <block type="breathing_preiod_angle_cycle">' +
    '       <value name="PERIOD">' +
    '             <block type="math_number">' +
    '               <field name="NUM">1</field> ' +
    '            </block>' +
    '       </value>' +
    '       <value name="DEGREE">' +
    '             <block type="math_number">' +
    '               <field name="NUM">90</field> ' +
    '            </block>' +
    '       </value>' +
    '       <value name="CYCLES">' +
    '             <block type="math_number">' +
    '               <field name="NUM">5</field> ' +
    '            </block>' +
    '       </value>' +
    '</block>' +

    '   <block type="shake">' +
    '      <value name="CYCLES">' +
    '        <block type="math_number">' +
    '          <field name="NUM">5</field>' +
    '        </block>' +
    '      </value>' +

    '   </block > ' +

    '   <block type ="heartbeat">' +
    '      <value name="DURATION">' +
    '        <block type="math_number">' +
    '          <field name="NUM">10</field>' +
    '        </block>' +
    '      </value>' +
    '   </block > ' +
    '  </category>' +

    '<category id="Transitions" name="Transitions">' +
    '       <block type="delay_between_angle">' +
    '           <value name="DELAY_TIME_MILI">' +
    '               <block type="math_number">' +
    '                   <field name="NUM">0.5</field>' +
    '               </block>' +
    '           </value>' +
    '       </block>' +

    '       <block type="delay_between_behavior">' +
    '           <value name="DELAY_TIME_MILI">' +
    '               <block type="math_number">' +
    '                   <field name="NUM">1</field>' +
    '               </block>' +
    '           </value>' +
    '       </block>' +
    // '       <block type="infinite_loop"/>' +
    // '       <block type="repeat_loop"/>' +
    '</category > ' +

    // customization
    '   <category id="Customization" name="Customization">' +
'   <block type="multi_servo_control">' +
'   </block>' +
'   <block type="start_sequence_repeat">' +
'      <value name="REPEATS">' +
'        <block type="math_number">' +
'          <field name="NUM">5</field>' +
'        </block>' +
'       </value>' +
'  </block>' +
'   <block type="single_cuddlebit_control">' +
'   </block>' +
'   <block type="set_servo_angle_speed">' +
'       <value name="ANGLE">' +
'             <block type="math_number">' +
'               <field name="NUM">60</field> ' +
'            </block>' +
'       </value>' +
'       <value name="SPEED">' +
'             <block type="math_number">' +
'               <field name="NUM">1</field> ' +
'            </block>' +
'       </value>' +
'   </block>' +
'   <block type="set_servo_angle_time">' +
'       <value name="ANGLE">' +
'             <block type="math_number">' +
'               <field name="NUM">60</field> ' +
'            </block>' +
'       </value>' +
'       <value name="TIME">' +
'             <block type="math_number">' +
'               <field name="NUM">0.5</field> ' +
'            </block>' +
'       </value>' +
'   </block>'

'</category > ' +

    '</xml>';
