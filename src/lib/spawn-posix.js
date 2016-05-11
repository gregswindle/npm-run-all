/**
 * @module spawn-posix
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const crossSpawn = require("cross-spawn-async");
const getDescendentProcessInfo = require("ps-tree");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Kills the new process and its sub processes.
 * @this ChildProcess
 * @returns {void}
 */
function kill() {
    getDescendentProcessInfo(this.pid, (err, descendent) => {
        if (err) {
            return;
        }

        descendent.forEach(({PID: pid}) => {
            try {
                process.kill(pid);
            }
            catch (_err) {
                // ignore.
            }
        });
    });
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Launches a new process with the given command.
 * This is almost same as `child_process.spawn`.
 *
 * This returns a `ChildProcess` instance.
 * `kill` method of the instance kills the new process and its sub processes.
 *
 * @param {string} command - The command to run.
 * @param {string[]} args - List of string arguments.
 * @param {object} options - Options.
 * @returns {ChildProcess} A ChildProcess instance of new process.
 * @private
 */
module.exports = function spawn(command, args, options) {
    const child = crossSpawn(command, args, options);
    child.kill = kill;

    return child;
};
