PlayerList = new Mongo.Collection('players');
//UserAccounts = new Mongo.Collection('users');

if(Meteor.isClient){
	Meteor.subscribe('thePlayers');
	Template.leaderboard.helpers({
		'player': function(){
			var currentUserId = Meteor.userId();
			return PlayerList.find({},{sort: {Score: -1 , name: 1}})
		},
		'biba': "mduaa",
		'selectedClass': function(){
			var playerId = this._id;
			var selectedPlayer = Session.get('selectedPlayer');
			if(playerId == selectedPlayer){
				return "selected";
			}
			
		},
		'showSelectedPlayer': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			return PlayerList.findOne(selectedPlayer);
		}
	});
	Template.leaderboard.events({
		'click .player': function(){
			var playerId = this._id;
			Session.set('selectedPlayer',playerId);
			
		},
		'click .increment': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			Meteor.call('modifyPlayerScore' , selectedPlayer , 5)
		},
		'click .decrement': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			Meteor.call('modifyPlayerScore' , selectedPlayer , -5)
		},
		'click .remove':function(){
			var selectedPlayer = this._id;
			Meteor.call('removePlayerData',selectedPlayer)
		}
	});
	
	Template.addPlayerForm.events({
		'submit form':function(event){
			event.preventDefault();
			var playerNameVal = event.target.playerName.value;
			Meteor.call('insertPlayerData' , playerNameVal);
			
			event.target.playerName.value = "";
			
		}
	});
}

if(Meteor.isServer){
	
Meteor.publish('thePlayers',function(){
	var currentUserId = this.userId;
	
	return PlayerList.find({createdBy: currentUserId});
});

Meteor.methods({
	'insertPlayerData': function(playerNameVal){
		var currentUserId = Meteor.userId();
		PlayerList.insert({
			name: playerNameVal,
			Score:0,
			createdBy: currentUserId
		});
	},
	'removePlayerData': function(selectedPlayer ){
		var currentUserId = Meteor.userId();
		PlayerList.remove({_id:selectedPlayer , createdBy: currentUserId});
	},
	'modifyPlayerScore': function(selectedPlayer , scoreVal){
		//console.log(selectedPlayer);
		var currentUserId = Meteor.userId();
		PlayerList.update({_id:selectedPlayer , createdBy:currentUserId}, {$inc: {Score: scoreVal} });
	}
});
	
}