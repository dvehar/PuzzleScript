// TODO
  // what is the var that says bumbing into the wall doesn't or does count?
  // what is the var that says there is or isn't a wait action
  var isThereAutoTick_rgts = false;
  // more clipping based on queries??
 
// Queries
  //  1 * winnable
var check_query_winnable = true; // is the query on? // TODO change
var query_winnable = false; // is the query satisfied
  // 2 * winnable_through [1,1,1,0,3,0,1,1]  [1,1,1,0,0,3,1,1] 
var check_query_winnable_through = false; // is the query on?
var query_winnable_through_state_queue = []; // states
var query_winnable_through_state_idx = 0; // the current state we are trying to process
  // 3 * winnable_not_through [1,1,1,0,3,0,1,1]  [1,1,1,0,0,3,1,1] -- more like traces where the user has passed though the states and hasn't yet won
var check_query_not_winnable_through = false; // is the query on?
var query_not_winnable_through_state_queue = []; // states left
var query_not_winnable_through_state_idx = 0; // the current state we are trying to process
  // 4 * visits
var check_query_visits = false; // is the query on?
var query_visits_states = []; // states to visit
var query_visits_idx = 0; // the current state to process.
  // 5 * from_state_dont state move
var check_query_from_state_dont = false; // is the query on?
var query_from_state_dont_state = []; // the state
var query_from_state_dont_move = []; // the moves that the player is expected to make
var query_from_state_dont_made = false; // was a unexpected move made?
  // 6 * visit_no_return state
var check_query_visit_no_return = false; // is the query on?
var query_visit_no_return_state = []; // the state
var query_visit_no_return_visited = false; // 1st time
var query_visit_no_return_returned = false; // 2nd time

// RGTS
var max_depth = 1; // very deep
var wildcard = "";
var legend = ""; // todo remove ? 

function logMessage(m) {
	postMessage("MSG:"+m);
}

// will push all query state variables on a stack in order then return the stack
// only pushes the values for queries that are turned on
function queryBackup () {
  var ret = [];
  // query_winnable is handled in the dls // query 1
  if (check_query_winnable_through) // query 2
    ret.push(query_winnable_through_state_idx);
  if (check_query_not_winnable_through) // query 3
    ret.push(query_not_winnable_through_state_idx);
  if (check_query_visits) // query 4
    ret.push(query_visits_idx);
  if (check_query_from_state_dont) // query 5 
    ret.push(query_from_state_dont_made);
  if (check_query_visit_no_return) { // query 6
    ret.push(query_visit_no_return_visited);
    ret.push(query_visit_no_return_returned);
  }
  return ret;
}

/* pre: the ary should have an entry for all enabled queries. see queryBackup() 
 *      for expected format. This precondition is currently checked but must be
 *      respected for the rgts to be functional
 * note: ary will not be modified (for effiency)
 * * * * * * * * * * * * * * * * */
function queryRestore (ary) {
  var len = ary.length;
  if (check_query_visit_no_return) { // query 6
    query_visit_no_return_returned = ary[--len];
    query_visit_no_return_visited = ary[--len];
  }
  if (check_query_from_state_dont) // query 5 
    query_from_state_dont_made = ary[--len];
  if (check_query_visits) // query 4
    query_visits_idx = ary[--len];
  if (check_query_not_winnable_through) // query 3
    query_not_winnable_through_state_idx = ary[--len];
  if (check_query_winnable_through) // query 2
    query_winnable_through_state_idx = ary[--len];
  // query_winnable is handled in the dls // query 1
}

function copyLevelState(level) {
	// return JSON.stringify(level);
	var s = new Int32Array(level.objects.length);
	for (var i=0; i < level.objects.length; ++i) {
	    s[i] = level.objects[i];
	}
	return s;
}

function levelState(level) {
	// return JSON.stringify(level);
	return level.objects;
}

function equalStates(arr1, arr2) {
	if(arr1.length != arr2.length) { return false; }
	for(var i=0; i < arr1.length; i++) {
		if(arr1[i] != arr2[i]) { return false; }
	}
	return true;
}

/* explores the state space while keeping track of query statisfaction. Will
 * dump a trace for every state that satifies the queries. cuts search branches
 * as frequently as possible (game was won so don't continues to search, there
 * no wait moves so don't search wait moves, there are no action moves so don't
 * search action moves, ... */
function dls(depth, movesMade, stack) {
  var i = 100;
  i = i +1;
  
  // update the query variables
  // if (check_query_winnable_through) { //q2
  //   if (query_winnable_through_state_idx < query_winnable_through_state_queue.length) {
  //     var curr_idx = query_winnable_through_state_idx;
  //     var curr_state_in_queue = query_winnable_through_state_queue[curr_idx];
  //     if(curr_state_in_queue === JSON.stringify(level)) {
  //       ++query_winnable_through_state_idx;
  //     }
  //   }
  // }
  // 
  // if (check_query_not_winnable_through) { // q3
  //   if (query_not_winnable_through_state_idx < query_not_winnable_through_state_queue.length) {
  //     var curr_idx = query_not_winnable_through_state_idx;
  //     var curr_state_in_queue = query_not_winnable_through_state_queue[curr_idx];
  //     if(curr_state_in_queue === JSON.stringify(level)) {
  //       ++query_not_winnable_through_state_idx;
  //     }
  //   }
  // }
  // 
  // if (check_query_visits) { // q4
  //   if (query_visits_idx < query_visits_states.length) {
  //     if (query_visits_states[query_visits_idx] === JSON.stringify(level)) {
  //       ++query_visits_idx;
  //     }
  //   }
  // }
  
  // check_query_from_state_dont (query 5) is updated when movements are made
  // 
  // if (check_query_visit_no_return) { // q6
  //   if (JSON.stringify(level) === query_visit_no_return_state) {
  //     if (query_visit_no_return_visited) {
  //       query_visit_no_return_returned = true;
  //     } else {
  //       // no need to search deeper on branches steming from this state.
  //       query_visit_no_return_visited = true; 
  //     }
  //   }
  // }
  
  // update the engine for wins and try dumping a trace
  if (winning) {
    logMessage("I won");
    // set the winnable query flag to true and try dumping the trace
    query_winnable = true;
    outputTrace(stack);
    // reset the game to a move before
    query_winnable = false;
    againing=false;
    winning=false;
    inputHistory.pop(); // pop off "win" that is automaticly pushed
    inputHistory.pop(); // pop off the move that lead to a win
    stack.pop(); // pop off the move that lead to a win
    DoUndo(); // revert to before you made the winning move
    return; // don't play past a win
  } else {
    outputTrace(stack);
  }
  // logMessage("try")
  // search further and update the #5 query (from_state_dont)
  if (depth > 0) {
    var curr_state = copyLevelState(level);
		//logMessage("CS:"+JSON.stringify(level)) 
    var query_state = queryBackup();
    
    // try moving up
    processInput(0);
    while (againing) {
      processInput(-1);			
    }
		//logMessage("CS2:"+JSON.stringify(level)) 
    var new_state = levelState(level);
    if (equalStates(new_state, curr_state)) {
   logMessage("nothing happened when moving up.");  
    } else {
      stack.push("up");
      pushInput(0);
//    logMessage(curr_state);
//    logMessage(new_state);
      if (check_query_from_state_dont) {
        if (equalStates(query_from_state_dont_state, curr_state)) {
          if (query_from_state_dont_move.indexOf("up") != -1) { // is up not an expected move?
            query_from_state_dont_made = true; // yes so an unexpected move was made
          }
        }
      }
      dls(depth-1, true, stack);
      queryRestore(query_state);
    }
    
    // try moving left
    processInput(1);
    while (againing) {
      processInput(-1);			
    }
    new_state = levelState(level);
    if (equalStates(new_state, curr_state)) {
   logMessage("nothing happened when moving left.");  
    } else {
      stack.push("left");
      // logMessage(curr_state);
      // logMessage(new_state);
      if (check_query_from_state_dont) {
        if (equalStates(query_from_state_dont_state, curr_state)) {
          if (query_from_state_dont_move.indexOf("left") != -1) { // is up not an expected move?
            query_from_state_dont_made = true; // yes so an unexpected move was made
          }
        }
      }
      dls(depth-1, true, stack);
      queryRestore(query_state);
    }
    
    // try moving down
    processInput(2);
    while (againing) {
      processInput(-1);			
    }
    new_state = levelState(level);
    if (equalStates(new_state, curr_state)) {
   logMessage("nothing happened when moving down.");  
    } else {
      stack.push("down");
      pushInput(2);
      // logMessage(curr_state);
      // logMessage(new_state);
      if (check_query_from_state_dont) {
        if (equalStates(query_from_state_dont_state, curr_state)) {
          if (query_from_state_dont_move.indexOf("down") != -1) { // is up not an expected move?
            query_from_state_dont_made = true; // yes so an unexpected move was made
          }
        }
      }
      dls(depth-1, true, stack);
      queryRestore(query_state);
    }
    
    // try moving right
    processInput(3);
    while (againing) {
      processInput(-1);			
    }
    new_state = levelState(level);
    if (equalStates(new_state, curr_state)) {
   logMessage("nothing happened when moving right.");  
    } else {
      stack.push("right");
      pushInput(3);
      // logMessage(curr_state);
      // logMessage(new_state);
      if (check_query_from_state_dont) {
        if (equalStates(query_from_state_dont_state, curr_state)) {
          if (query_from_state_dont_move.indexOf("right") != -1) { // is up not an expected move?
            query_from_state_dont_made = true; // yes so an unexpected move was made
          }
        }
      }
      dls(depth-1, true, stack);
      queryRestore(query_state);
    }
    
    // try moving action
    processInput(4);
    while (againing) {
      processInput(-1);			
    }
    new_state = levelState(level);
    if (equalStates(new_state, curr_state)) {
   logMessage("nothing happened when making an action.");  
    } else {
			// logMessage("Did an action?! "+JSON.stringify(curr_state) + " vs " + JSON.stringify(new_state));
			// logMessage("new level "+JSON.stringify(level))
      stack.push("action");
      pushInput(4);
      // logMessage(curr_state);
      // logMessage(new_state);
      if (check_query_from_state_dont) {
        if (equalStates(query_from_state_dont_state, curr_state)) {
          if (query_from_state_dont_move.indexOf("action") != -1) { // is up not an expected move?
            query_from_state_dont_made = true; // yes so an unexpected move was made
          }
        }
      }
      dls(depth-1, true, stack);
      queryRestore(query_state);
    }
    
    // try moving wait
    if (isThereAutoTick_rgts) {
      stack.push("wait");
      autoTickGame();
      // pushInput("wait");   done automaticly? TODO confirm
      if (check_query_from_state_dont) {
        if (equalStates(query_from_state_dont_state, curr_state)) {
          if (query_from_state_dont_move.indexOf("wait") != -1) { // is up not an expected move?
            query_from_state_dont_made = true; // yes so an unexpected move was made
          }
        }
      }
      dls(depth-1, true, stack);
      queryRestore(query_state);
    }  
  } else if (movesMade) {
		// logMessage("Giving up after:"+JSON.stringify(inputHistory));
		// logMessage("Winning?"+winning);
		// logMessage("Stack:"+JSON.stringify(stack));
    // outputTrace(stack);
    // logMessage(JSON.stringify(level));
  }
	inputHistory.pop();
	stack.pop();
  DoUndo(); 
}

/* if all the active queries are satified the trace will be dumped
 * otherwise, does nothing */
function outputTrace (stack) {
  if (passes_queries()) {
    var str = "";
    if (stack.length > 0) {
      for (var i = 0; i < stack.length-1; ++i) {
        str += stack[i] + " ";
      }
      str += stack[stack.length-1];
      self.postMessage("Trace: " + str);
    }
  }
}

// if all queries hold return true else false.
function passes_queries() {
  var result = true;
  
	logMessage("Winning? "+winning);
	
  // query 1
  if (result && check_query_winnable) {
    result = query_winnable;
  }
  
  // query 2
  if (result && check_query_winnable_through) {
    var goal_idx = query_winnable_through_state_queue.length + 1;
    result = (query_winnable_through_state_idx === goal_idx);
    result = (result && winning);
  }
  
  // query 3
  if (result && check_query_not_winnable_through) {
    var goal_idx = query_not_winnable_through_state_queue.length + 1;
    result = (query_not_winnable_through_state_idx === goal_idx);
    result = (result && !winning);
  }
  
  // query 4
  if (result && check_query_visits) {
    var goal_idx = query_visits_states.length + 1;
    result = (query_visits_idx === goal_idx);
  }
  
  // query 5
  if (result && check_query_from_state_dont) {
    result = query_from_state_dont_made;
  }
  
  // query 6
  if (result && check_query_visit_no_return) {
    result = query_visit_no_return_visited;
    result = result && !query_visit_no_return_returned;
  }
  
  return result; 
  //return true;
}

// get the the rgts and puzzlescript ready for searching the state space
function rgts_init (puzzle_src, level) {
  /* load the scripts needed */
  importScripts('wrapper_rgts.js', 
                'globalVariables.js', 'debug.js', 'font.js', 'rng.js',
                'riffwave.js', 'sfxr.js', 'codemirror/codemirror_rgts.js', 
                'codemirror/active-line.js', 'colors.js', 'engine_rgts.js',
                'parser_rgts.js', 'compiler_rgts.js', 'soundbar.js');
  // verbose_logging = true;
  /* set Puzzlescript to unit testing mode */
  unitTesting=true;
	testsAutoAdvanceLevel = false;
  
  /* compile the source */
  compile(["loadLevel",level],puzzle_src,null);
  
  self.postMessage(JSON.stringify(level)); 
  
	while (againing) {
		againing=false;
		processInput(-1);			
	}
  
  /* todo check if they set a custom max depth
   * make sure it is >= 0 */
  
  /* todo check if they set a custom wildcard character
   * make sure it isn't in use */

  /* todo set up the queries */
  
  self.postMessage("restart and redraw"); // restart and redraw the puzzlescript state
}

// translate the query string to the query number or -1 on error
function getQueryHeader (str) {
  var ret = -1;
  
  if (str === "winnable")
    ret = 1;
  else if (str === "winnable_through")
    ret = 2;
  else if (str === "not_winnable_through")
    ret = 3;
  else if (str === "visits")
    ret = 4;
  else if (str === "from_state_dont")
    ret = 5;
  else if (str === "visit_no_return")
    ret = 6;
  
  return ret;
}

/* suported quries...
 1 * winnable
 2 * winnable_through # state1 state2 ... state#
 3 * not_winnable_through # state1 state2 ... state#
 4 * visits # state1 state2 ... state#
 5 * from_state_dont move1 state1
 6 * visit_no_return state1
 * 
 1 = traces that lead to a win
 2 = traces that lead to a win while having vistited the given states in that order. the states support wild cards.
 3 = traces where the player has passed though the states and hasn't yet won
 4 = traces that went through all of the given states in any order. the states support wild cards.
 5 = traces that didn't do move when in the _state_ state
 6 = traces that visit a stace but don't return to it 
 */
 /*
function setUpQueries() {
  // var qfile = 
  var instream = fs.createReadStream(qfile);
  var outstream = new stream;
  var linenr = 0;
  var rl = readline.createInterface(instream, outstream);
  
  var current_query = -1;
  //var expecting = -1; // -1 -> no expectation, -2 -> a row of the state, # > 0 the next state.
  
  var load_states = false;
  var states_left = 0;
  var ary_ref = null; // points to the query's ary we are changing
  var tmp_ary = []; // 
  var width = -1; // how wide the level is
  
  var valid_moves = ["up", "down", "left", "right", "action", "wait"];

  // set up the legend
  for (var i=0; i < state.legend_synonyms.length; ++i) {
  	logMessage(state.legend_synonyms[i][0] + " " + wildcard + (state.legend_synonyms[i][0] === wildcard) + " " + (state.legend_synonyms[i][0] == wildcard));
    if (state.legend_synonyms[i][0] === wildcard) {
      logMessage(qfile + ": " + linenr + ": Wildcard, " + wildcard + ", is already in use.");
      process.exit(1);
    }
    legend += state.legend_synonyms[i][0];
  }

  // set up legend_conversion
  var legend_converter = [];
  for(var property in state.objectMasks) {
    if (state.objectMasks.hasOwnProperty(property) && property.length == 1) { 
      logMessage(property);
      logMessage(state.objectMasks[property]);
      //legend_converter[property] = state.objectMasks[property].data[0];
      var val = state.objectMasks[property];
      legend_converter[property] = (val === 1)? 1:(val+1);
    }
  }
  
  rl.on('line', function(line) {
    ++linenr;
    var ary = line.split(" ");
    if (current_query === -1) {
      if (ary.length < 1) {
        logMessage(qfile + ": " + linenr + ": Expecting a query header");
        process.exit(1);
      } else {
        current_query = getQueryHeader(ary[0]);
                    logMessage(ary[0] + " -> current query = " + current_query); 
        load_states = true; // asume by default
        switch (current_query) {
        case 1:
          check_query_winnable = true;
          load_states = false;
          current_query = -1;
          break;
        case 2:
          check_query_winnable_through = true;
          if (ary.length !== 3) {
            logMessage(qfile + ": " + linenr + ": Invalid length for query");
            process.exit(1);
          }
          states_left = parseInt(ary[1], 10);
          if (states_left < 1) {
            logMessage(qfile + ": " + linenr + ": Need atleast 1 state");
            process.exit(1);
          }
          ary_ref = query_winnable_through_state_queue;
          break;
        case 3:
          check_query_not_winnable_through = true;
          if (ary.length !== 3) {
            logMessage(qfile + ": " + linenr + ": Invalid length for query");
            process.exit(1);
          }
          states_left = parseInt(ary[1], 10);
          if (states_left < 1) {
            logMessage(qfile + ": " + linenr + ": Need atleast 1 state");
            process.exit(1);
          }
          ary_ref = query_not_winnable_through_state_queue;
          break;
        case 4:
          check_query_visits = true;
          if (ary.length !== 2) {
            logMessage(qfile + ": " + linenr + ": Invalid length for query");
            process.exit(1);
          }
          states_left = parseInt(ary[1], 10);
          if (states_left < 1) {
            logMessage(qfile + ": " + linenr + ": Need atleast 1 state");
            process.exit(1);
          }
          ary_ref = query_visits_states;
          break;
        case 5:
          if (ary.length !== 2) {
            logMessage(qfile + ": " + linenr + ": Invalid length for query");
            process.exit(1);
          }
          for (var i=1; i < ary.length; ++i) {
            var move = valid_moves.indexOf(ary[1]);
            if (move === -1) {
              logMessage(filename + ": " + linenr + ": invalid move: " + ary[1]);
              process.exit(1);
            } 
            query_from_state_dont_move.push(move);
          }
          check_query_from_state_dont = true;
          break;
        case 6:
          check_query_visit_no_return = true;
          break;
        default:
          logMessage(qfile + ": " + linenr + ": Invalid query header");
          process.exit(1);
          //expecting = -1;
          load_states = false;
          break;
        }
      }
    } else if (load_states) { // query 2 - 6
      if (width === -1) {
        width = line.length;
        if (width === 0) {
          logMessage(filename + ": " + linenr + ": expecting 1st line of level");
          process.exit(1);
        }
        
        for (var i=0; i<width; ++i) {
          tmp_ary.push([]);
        }
        
        for (var i=0; i < line.length; ++i) { 
          if (legend.indexOf(line[i]) == -1) {
            logMessage(filename + ": " + linenr + ": invalid symbol: " + line[i]);
            process.exit(1);
          }
          tmp_ary[i].push(line[i]);// transpose it
        }
        logMessage("pushing: " + line);
      } else if (line === "") { // empty line
        --states_left;
        // flatten tmp_ary
        var tmp = [];
        for (var i=0; i < tmp_ary.length; ++i) {
          logMessage(linenr + " $ " + tmp_ary[i]);
          for (var j=0; j < tmp_ary[i].length; ++j) {
            //tmp.push(tmp_ary[i][j]);
            tmp.push(legend_converter[tmp_ary[i][j]]);
          }
        }
        tmp_ary = [];
        width = -1;
        // store into the query queue
        ary_ref.push(tmp);
        logMessage(JSON.stringify(tmp));
        logMessage(">>>>>>>>>>>>>>>>>>");
        //var p = [];
        //for (var qq=0; qq<180; ++qq)
        //  p.push(qq);
        logMessage(p);  
        logMessage(tmp.length);
        logMessage(tmp);
        logMessage(">>>>>>>>>>>>>>>>>>");
        if (states_left === 0) {
          load_states = false;
          ary_ref = null;
          logMessage("$$$$$$$$$$$$$$$$$$");
          logMessage(query_visits_states);
          logMessage("$$$$$$$$$$$$$$$$$$");
        }  
      } else if (line.length !== width) {
        logMessage(qfile + ": " + linenr + ": invalid width");
        process.exit(1);
      } else {
        for (var i=0; i < line.length; ++i) { 
          if (legend.indexOf(line[i]) == -1) {
            logMessage(legend);
            logMessage(qfile + ": " + linenr + ": invalid symbol: " + line[i]);
            process.exit(1);
          }
          tmp_ary[i].push(line[i]);// transpose it
        }
        logMessage("pushing: " + line);
      }
    } else {
      current_query = -1; 
    }
  });
  rl.on('close', function() {
    logMessage("queries initilized");
    logMessage(JSON.stringify(level));
  });
}
*/

self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg);
      for (var i=0; i < 5; ++i) {
        self.postMessage("test message: " + i);
      }
      logMessage("Starting the search");
      rgts_init(data.msg, data.lvl);
      //dls(max_depth,false,[]);
      dls(8,false,[]); // TODO Desmond Change
			postMessage("search finished?")
      break;
    /*case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg);
      self.close(); // Terminates the worker.
      break;
    */
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);


/* editor.getValue() */
