module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Play File",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "Audio Control",

  //---------------------------------------------------------------------
  // Requires Audio Libraries
  //
  // If 'true', this action requires audio libraries to run.
  //---------------------------------------------------------------------

  requiresAudioLibraries: true,

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.url}`;
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding Ids in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["url", "seek", "volume", "passes", "bitrate", "type"],

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

  html(isEvent, data) {
    return `
<div>
	<span class="dbminputlabel">Local URL</span><br>
	<input id="url" class="round" type="text" value="resources/"><br>
</div>
<div style="float: left; width: 50%;">
	<span class="dbminputlabel">Seek Position</span><br>
	<input id="seek" class="round" type="text" value="0"><br>
	<span class="dbminputlabel">Passes</span><br>
	<input id="passes" class="round" type="text" value="1">
</div>
<div style="float: right; width: 50%;">
	<span class="dbminputlabel">Volume (0 = min; 100 = max)</span><br>
	<input id="volume" class="round" type="text" placeholder="Leave blank for automatic..."><br>
	<span class="dbminputlabel">Bitrate</span><br>
	<input id="bitrate" class="round" type="text" placeholder="Leave blank for automatic...">
</div>

<br><br><br><br><br><br><br>

<div>
	<span class="dbminputlabel">Play Type</span><br>
	<select id="type" class="round" style="width: 90%;">
		<option value="0" selected>Add to Queue</option>
		<option value="1">Play Immediately</option>
	</select>
</div>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const Audio = this.getDBM().Audio;
    const options = {};
    if (data.seek) {
      options.seek = parseInt(this.evalMessage(data.seek, cache), 10);
    }
    if (data.volume) {
      options.volume = parseInt(this.evalMessage(data.volume, cache), 10) / 100;
    } else if (cache.server) {
      options.volume = Audio.volumes[cache.server.id] || 0.5;
    } else {
      options.volume = 0.5;
    }
    if (data.passes) {
      options.passes = parseInt(this.evalMessage(data.passes, cache), 10);
    }
    if (data.bitrate) {
      options.bitrate = parseInt(this.evalMessage(data.bitrate, cache), 10);
    } else {
      options.bitrate = "auto";
    }
    const url = this.evalMessage(data.url, cache);
    if (url) {
      const info = ["file", options, url];
      if (data.type === "0") {
        Audio.addToQueue(info, cache);
      } else if (cache.server) {
        Audio.playItem(info, cache.server.id);
      }
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

  mod() {},
};
