module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Set Embed Footer",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "Embed Message",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle: function (data, presets) {
    return `${data.message}`;
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding Ids in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["storage", "varName", "message", "footerIcon"],

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //
  // The "data" parameter stores constants for select elements to use.
  // Each is an array: index 0 for commands, index 1 for events.
  // The names are: sendTargets, members, roles, channels,
  //                messages, servers, variables
  //---------------------------------------------------------------------

  html: function (isEvent, data) {
    return `
<retrieve-from-variable dropdownLabel="Source Embed Object" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable><br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Footer</span><br>
	<textarea id="message" rows="3" placeholder="Insert footer here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div style="float: left; width: 99%;">
	<span class="dbminputlabel">Footer Icon URL</span><br>
	<input id="footerIcon" class="round" type="text" placeholder="Leave blank for none!"><br>
</div>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init: function () {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  //---------------------------------------------------------------------

  action: function (cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const embed = this.getVariable(storage, varName, cache);
    if (embed && embed.setFooter) {
      embed.setFooter(this.evalMessage(data.message, cache), this.evalMessage(data.footerIcon, cache));
    }
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  //---------------------------------------------------------------------

  mod: function () {},
};
