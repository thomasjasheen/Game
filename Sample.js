var cardType=["1CLAVER","2DICE","3SPADES","4HEARTS"];
var playerNames=["player0","player1","player2","player3"];
var allcards=new Array();
var playercards=new Array(4);
var cardontable=new Array();
var MAX=14;           //14 = ACE
var comment;
var starter;
var round=0;
var playerobj=new Array();
var decks=new Array();
var noofplayers=playerNames.length;
var parent=new Array(4); // parent getElementById for each player.
var decks=new Array(4);  // deck for each player where they will place the cards
var nextPlayer;
var debug=0;
var isCut =0;              // was the last put result in cut.
var callBackVariable;      // variable used for stopping the timer
var delay=2000;
var gameFinished = 0;


function initializedeck()
{
 decks[0]=document.getElementById("player0deckcard");
 decks[1]=document.getElementById("player1deckcard");
 decks[2]=document.getElementById("player2deckcard");
 decks[3]=document.getElementById("player3deckcard");
 parent[0]=document.getElementById("player0tr");
 parent[1]=document.getElementById("player1table");
 parent[2]=document.getElementById("player2tr");
 parent[3]=document.getElementById("player3table");
 comment=document.getElementById("comment");
}
/*player object*/
function Player(id, name,cards,deck){
	this.id = id;
	this.name=name;
	this.cards=cards;
	this.deck=deck;
}
Player.prototype.isPlayerEmpty=function()
{
	if (this.cards.length)
		return 0;
	return 1;
}
Player.prototype.checkForAvailibilityOfCardType=function (type)
{
	for(i = 0; i< this.cards.length; i++)
	{
		if(this.cards[i].type == type)
		{
			return 1;
		}
	}
	return 0;
}
Player.prototype.putCard=function (type,value)
{
	var max=0;
    // Assume that this player won the game so stop the game.
	if (this.isPlayerEmpty())
	{
		comment.innerHTML=this.name +" HAS WON THE GAME.. STOPPING THE GAME.";
		clearInterval(callBackVariable);
		gameFinished = 1;
		return;
		//findNextPlayer(this)
		//removePlayerFromArray(this);
		
	}
	if (this.name == playerNames[0])
	{
		comment.innerHTML="please put the card player 0";
		return;
	}
	
	// Assume that this player won the game so stop the game.
	if (this.isPlayerEmpty())
	{
		comment.innerHTML=this.name +" HAS WON THE GAME.. STOPPING THE GAME.";
		clearInterval(callBackVariable);
		return;
		//findNextPlayer(this)
		//removePlayerFromArray(this);
		
	}
	
	//If he is a starter this round
	if(type== undefined&&value==undefined)
	{
		// give better logic
		var k=Math.floor(Math.random() * this.cards.length);
		max=this.cards[k];
		cardontable.push(this.cards[k]);
		ondeck2(this.cards[k],this);
		this.cards.splice(k,1);
		

		return max;
		
	}
	// Logic for now is to put largest card with same symbol
	for(i=0;i<this.cards.length;i++)
	{
		if(this.cards[i].type==type)
		{
			max=this.cards[i];
			k=i;

		}
	}
	/*give cut*/
	if(max==0)
	{
		k = findMaxCardPositionFromArray(this.cards);

		isCut = 1;
	}
	cardontable.push(this.cards[k]);
	this.cards.splice(k,1);
	ondeck2(max,this);
	return max;
};
Player.prototype.sortCards=function()
{
	this.cards.sort(function(a, b) {
		return a.id - b.id;
	});
}


function removePlayerFromArray(playerToBeRemoved)
{
	var i=0;
	for (i=0;i<playerobj.length; i++)
	{
		if (playerobj.name == playerToBeRemoved.name)
		{
			playerobj.splice(i,1);
			break;
		}
	}
}
function findNextPlayerBasedOnCurrentPlayer(player)
{
	var index = playerobj.indexOf(player);
	nextPlayer=playerobj[(index+1)%playerobj.length];
}		

function findPlayerObjBasedOnName(playerName)
{
	var i = 0;
	for(i=0;i<playerobj.length; i++)
	{
		if(playerobj[i].name == playerName){
			return playerobj[i];
		}
	}
	document.write("findPlayerObjBasedOnName:returning NULL");
	return null;
}
	
//card object
function Card(value,type,owner,id,status)
{
	this.value=value;
	this.type=type;
	this.owner=owner;
	this.id=id;
	this.status;
}
Card.prototype.toString=function()
{
	  	var txt,val=this.value,typ;
	  	if(this.type=="1CLAVER"){typ="c";}
	  	else if(this.type=="2DICE"){typ="d";}
		else if(this.type=="4HEARTS"){typ="h";}
		else if(this.type=="3SPADES"){typ="s";}
	  	if(this.value==11){val="j";}
	  	else if(this.value==12){val="q";}
	  	else if(this.value==13){val="k";}
	  	else if(this.value==14){val="a";}
	  	txt=typ+val;
	  	
       	return txt;
};

function findMaxCardPositionFromArray(arrayOfCards)
{
	var max = arrayOfCards[0];
	var i   = 0;
	var k   = 0;
	for(i=0;i<arrayOfCards.length-1;i++)
	{
		if(max.value<arrayOfCards[i+1].value)
		{
			max=arrayOfCards[i+1];
			k = i+1;
		}
	}
	return k;
}

function findMaxCardonTable()
{
	var max = cardontable[0];
	var i   = 0;
	var type= cardontable[0].type;
	for(i=0;i<cardontable.length-1;i++)
	{
		if((max.value<cardontable[i+1].value) 
			&& (type == cardontable[i+1].type))
		{
			max=cardontable[i+1];
		}
	}
	return max;
}

// Shuffle the cards and deal the cards
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function deal()
{
	initializedeck();
  	var i,j,k=0;
	for(i=2;i<=14;i++)
	{
		for(j=0;j<cardType.length;j++)
		{
			allcards.push(new Card(i,cardType[k%4],playerNames[k%noofplayers],k,0));
			k++;
		}
	}
	shuffle(allcards);
	k = 0;
    for(i=0;i<playerNames.length;i++)
    {
		var j =0;
    	  playercards[i]=new Array();
		  for (j=0;j<13;j++)
		  {
			  allcards[k].owner = playerNames[i];
			  playercards[i].push(allcards[k]);
			  k++;
		  }
		  playercards[i].sort(cardCompareFunction);
          playerobj.push(new Player(i, playerNames[i],playercards[i],decks[i]));
    }
    userinterface();
    startgame();    	
}

function randomcard(player)
{
	var k=Math.floor(Math.random() * player.cards.length);
	var card=player.cards[k];
	cardontable.push(player.cards[k]);
	player.cards.splice(k,1);
	ondeck2(card,player);
	return card;
	
}

function getPlayerCards(player)
{
	var playercard=new Array();
	var i;
	for(i=0;i<52;i++)
	{
		if(allcards[i].owner==player)
			{
			 playercard.push(allcards[i]); 
			}
	}
	return playercard;
}

function userinterface()
{ 
	var i;
	for(i=0;i<4;i++)
	{
		if (parent[i])
		{
			while (parent[i].firstChild) 
			{
				parent[i].removeChild(parent[i].firstChild);
			}
		}
	}
	if (nextPlayer)
	{
		comment.innerHTML="Round "+round+": "+nextPlayer.name+" has to start the game";
	}
	for(i=0;i<playerobj[0].cards.length;i++)
    {  
		
    	var td=document.createElement("td");   
    	var txt=playerobj[0].cards[i];
    	var img=document.createElement("img");
    	img.alt=txt;
    	txt="cards/"+txt+".gif";
        img.src=txt;
    	td.appendChild(img);
    	td.setAttribute("class", "card");
    	td.setAttribute("id",playerobj[0].cards[i].id);
    	var p=document.getElementById("player0deckcard");
    	td.onclick=function(){ondeck(this,p);};
    	td.id=playercards[0][i].id;
    	parent[0].appendChild(td);
   	}
    for(i=0;i<playerobj[3].cards.length;i++)
	{
    	var tr=document.createElement("tr");
    	var td=document.createElement("td");
    	var img=document.createElement("img");
 	    var txt=playerobj[3].cards[i];
 	    img.alt=txt;
		if(debug == 1)
		{
			txt="cards/"+txt+".gif";
		} 
 	    else if(i==0)
		{
			txt="cards/b2fv.gif";
		}
 	    else
		{
			txt="cards/b2pb.gif";
		}
        img.src=txt;
        td.appendChild(img);
	    td.setAttribute("class", "card");
	    td.id=playercards[3][i].id;
		tr.appendChild(td);
	    document.getElementById("player3table").appendChild(tr);
	}
    for(i=0;i<playerobj[2].cards.length;i++)
    {
    	var td=document.createElement("td");
    	td.id=playercards[2][i].id;
    	var img=document.createElement("img");
		var txt=playerobj[2].cards[i];
    	img.alt=txt;
    	if(debug == 1)
		{
			txt="cards/"+txt+".gif";
		} 
 	    else if(i==playerobj[2].cards.length-1)
		{ 
	        txt="cards/b2fv.gif";
		}
    	else
		{
			txt="cards/b2pl.gif";
		}	
        img.src=txt;
    	td.appendChild(img);
    	td.setAttribute("class", "card");
    	document.getElementById("player2tr").appendChild(td);
    }
    for(i=0;i<playercards[1].length;i++)
 	{
		var tr=document.createElement("tr");
 	    var td=document.createElement("td");
 	    var img=document.createElement("img");
	    var txt=playerobj[1].cards[i];
	    img.alt=txt;
	    if(debug == 1)
		{
			txt="cards/"+txt+".gif";
		} 
 	    else if(i==0)
		{
			txt="cards/b2fv.gif";
		}
	    else
		{
			txt="cards/b2pb.gif";
		}
        img.src=txt;
        td.appendChild(img);
 	    td.setAttribute("class", "card");
 	    // td.onclick=function(){ondeck(this);};
 	    td.id=playercards[1][i].id;
 	    tr.appendChild(td);
 	    document.getElementById("player1table").appendChild(tr);
 	}
	for (i = 0; i<playerNames.length; i++)
	{
		playerobj[i].deck.src="";
	}
	for (i = 0; i<cardontable.length; i++)
	{
		ondeck2(cardontable[i],
		        findPlayerObjBasedOnName(cardontable[i].owner));
	}
	
}


// Putting card on deck for user i.e. player 0
function ondeck(child,deck){
	var i;
	var txt;
	
	if( nextPlayer && 
	    (nextPlayer.name != playerobj[0].name))
	{
		return;
	}
 	for(i=0;i<playerobj[0].cards.length;i++)
 	{
 		if(child.id==playerobj[0].cards[i].id)
 		{
 			txt=playerobj[0].cards[i];
 			break;
 		}
 	}
	if (cardontable[0])
	{
		if (cardontable[0].type != playerobj[0].cards[i].type)
		{
			if (playerobj[0].checkForAvailibilityOfCardType(cardontable[0].type))
			{
				comment.innerHTML="Hello, "+playerobj[0].name+" you have to put card of type "+cardontable[0].type;
				return;
			}
			else
			{
				isCut = 1;
			}
		}
	}
	
	cardontable.push(playerobj[0].cards[i]);
	playerobj[0].cards.splice(i,1);
	var deck=document.getElementById("player0deckcard");
	
	//deck.alt=txt;
	txt="cards/"+txt+".gif";
	deck.src=txt;
	//deck.innerHTML=txt;
	//deck.appendChild(txt);
	
	var parent=document.getElementById("player0tr");
	parent.removeChild(child);	
	findNextPlayerBasedOnCurrentPlayer(nextPlayer);

}
// Putting card on deck for computer players i.e. player 1-3
function ondeck2(card,player){
	try
	{
		
		var txt=card;
		txt="cards/"+txt+".gif";
		player.deck.src=txt;
	}catch(e)
	{
		document.write(player.deck);		
	}
	
}

function cardCompareFunction(a,b)
{
	if (a.type == b.type)
	{
		return a.id - b.id;
	}
	return a.type.localeCompare(b.type); 
}

function startgame()
{
	var i;
	for (i=0; i<playerobj.length; i++)
	{
		playerobj[i].cards.sort(cardCompareFunction);
	}
	for(i=0;i<allcards.length;i++)
	{
		if(allcards[i].type==cardType[3]&&allcards[i].value==MAX){
			//document.write(allcards[i].owner);
			starter=allcards[i].owner;
			round++;
			comment.innerHTML="Round "+round+": "+starter+" has to start the game";
			break;
		}
	}
	nextPlayer = findPlayerObjBasedOnName(starter);
	nextPlayer.putCard(allcards[i].type,allcards[i].value);
	findNextPlayerBasedOnCurrentPlayer(nextPlayer);
	userinterface();
	callBackVariable = setInterval(continueGame, delay);
}


function continueGame(){
	var i;

	
	if (isCut == 1)
	{
		isCut =0;
		var maxCardonTable = findMaxCardonTable();
		nextPlayer = findPlayerObjBasedOnName(maxCardonTable.owner);
		var n = cardontable.length;
		for (i=0; i<n; i++)
		{
			var card = cardontable.pop();
			card.owner = nextPlayer.name;
			nextPlayer.cards.push(card);
		}
		round++;
		userinterface();
		return;
	}
	if (cardontable.length > playerobj.length)
	{
		document.write("ERROR CONDTION cardontable.length > playerobj.length" + cardontable.length +">"+playerobj.length);
	}
	// if all players have put the cards
	if (cardontable.length == playerobj.length)
	{
		var maxCardonTable = findMaxCardonTable();
		nextPlayer = findPlayerObjBasedOnName(maxCardonTable.owner);
        var n = cardontable.length;
		for (i=0; i<n; i++)
		{
		    cardontable.pop();
		}
		round++;
		userinterface();
		return;
	}
	if (cardontable[0])
	{
		nextPlayer.putCard(cardontable[0].type,cardontable[0].value);
	}
	else
	{
		nextPlayer.putCard(undefined,undefined);
	}
	//no need to process further if current Player is user
	if (nextPlayer.name !=  playerNames[0])
	{
		findNextPlayerBasedOnCurrentPlayer(nextPlayer);
	}
	if (gameFinished == 1)
		return;
	userinterface();
}