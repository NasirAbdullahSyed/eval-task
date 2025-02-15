
LEFT_TURN = ' \u21BA';

RIGHT_TURN = ' \u21BB';

Blockly.Blocks['actor_move_forward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("move forward")
        .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"]]), "actor_move_forward_distance");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['actor_move_backward'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("move backward")
          .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"]]), "actor_move_backward_distance");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(153,0,153);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

Blockly.Blocks['actor_jump_forward'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("jump forward")
            .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"]]), "actor_jump_forward_distance");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0,0,233);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['actor_turn'] = {
    /**
     * Block for turning left or right.
     * @this Blockly.Block
     */
    init: function() {
        var DIRECTIONS =
            [['move left', 'turnLeft'],
             ['move right', 'turnRight']];
        // Append arrows to direction messages.
        DIRECTIONS[0][0] += LEFT_TURN;
        DIRECTIONS[1][0] += RIGHT_TURN;
        // console.log(DIRECTIONS);
        this.setColour(80);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'actor_turn_direction');
        this.setPreviousStatement(true,null);
        this.setNextStatement(true,null);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
