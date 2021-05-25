/* global monogatari */

// Define the messages used in the game.
monogatari.action ('message').messages ({
	'Help': {
		title: 'Help',
		subtitle: 'Some useful Links',
		body: `
			<p><a href='https://developers.monogatari.io/documentation/'>Documentation</a> - Everything you need to know.</p>
			<p><a href='https://monogatari.io/demo/'>Demo</a> - A simple Demo.</p>
		`
	}
});

// Define the notifications used in the game
monogatari.action ('notification').notifications ({
	'Welcome': {
		title: 'Welcome',
		body: 'This is the Monogatari VN Engine',
		icon: ''
	}
});

// Define the Particles JS Configurations used in the game
monogatari.action ('particles').particles ({

});

// Define the canvas objects used in the game
monogatari.action ('canvas').objects ({

});

// Credits of the people involved in the creation of this awesome game
monogatari.configuration ('credits', {

});


// Define the images that will be available on your game's image gallery
monogatari.assets ('gallery', {

});

// Define the music used in the game.
monogatari.assets ('music', {
	'MainMusic': 'MainMusic.mp3'
});

// Define the voice files used in the game.
monogatari.assets ('voices', {

});

// Define the sounds used in the game.
monogatari.assets ('sounds', {

});

// Define the videos used in the game.
monogatari.assets ('videos', {

});

// Define the images used in the game.
monogatari.assets ('images', {

});

// Define the backgrounds for each scene.
monogatari.assets ('scenes', {

});


// Define the Characters
monogatari.characters ({
	'y': {
		name: 'Yui',
		color: '#5bcaff'
	},
	'e': {
		name: "Elder",
		color: '#5bcaff',
		sprites: {
			elder: 'Elder.png'
		}
	}
});

monogatari.script ({
	// The game starts here.
	'Start': [
		'show scene #f7f6f6 with fadeIn',
		'show background url("assets/scenes/blue_background.png")',
		'play music MainMusic.mp3 with loop',
		'Stars zoom past your ship as you make your way through space. Navigating the stars is difficult, but you are an experienced pilot.',
		'Suddenly, alarm bells begin to clang throughout the cabin. Something begins pulling your ship off course!',
		'You jump to your feet to rush to the controls, but you are thrown to the floor and your vision goes black.',
		'show background url("assets/scenes/SnowyForest_b_02.png")',
		'When you regain consciousness, your eyes open to see an alien planet. Stumbling through the dense forest, you notice a golden light illuminating a path through the forest.',
		'You follow the shimmering light until you reach clearing, and notice a strange being is standing in the open.',
		'show character e elder at right',
		'e You crashed here?',
		"You nod.",
		"e Let us help you.",
		"e One thing I should mention -- in our culture, each members has developed a unique movement to greet each other. For example, try to match the movements on the right of the screen in order to learn my personal greeting.",
		'hide character e',
		'show pose_trainer aaa',
		'hide pose_trainer',
		'You will be prompted by a statement and asked to answer a question.',
		`Is the following statement <strong>always true</strong> or is it <strong>false</strong>?<br>
		Speak your answers out loud as we voice record your voice.<br><br><br>
		<strong>The diagonals of a rectangle always have the same length</strong>`,
		`Explain why the statement is <strong>always true</strong> or is <strong>false</strong>.<br>
		Speak your answers out loud as we voice record your voice:<br><br><br>
		<strong>The diagonals of a rectangle always have the same length</strong>`,
		'centered',
		{
			'Choice': {
				// 'Dialog': 'The diagonals of a rectangle always have the same length.',
				'A': {
					'Text': 'FALSE: Since a rectangle has shorter sides and longer sides, the diagonals will not be the same length.',
					'Do': 'jump Incorrect'
				},
				'B': {
					'Text': 'TRUE: Each diagonal divides any quadrilateral into two triangles that are the same.',
					'Do': 'jump Correct'
				},
				'C': {
					'Text': 'FALSE: Only a square has diagonals that are the same length.',
					'Do': 'jump Correct'
				},
				'D': {
					'Text': 'TRUE: Opposite sides of a rectangle are the same, so the right triangles formed by the diagonals have matching lengths for each of their side.',
					'Do': 'jump Incorrect'
				}
			}
		}
	],
	'Correct': [
		'show character e',
		'e Correct!',
		'end'
	],
	'Incorrect': [
		'show character e',
		`e I'm sorry, that wasn't quite correct`,
		'end'
	]

	// 'Start': [
	// 	'show scene #f7f6f6 with fadeIn',
	// 	'show notification Welcome',
	// 	{
	// 		'Input': {
	// 			'Text': 'What is your name?',
	// 			'Validation': function (input) {
	// 				return input.trim ().length > 0;
	// 			},
	// 			'Save': function (input) {
	// 				this.storage ({
	// 					player: {
	// 						name: input
	// 					}
	// 				});
	// 				return true;
	// 			},
	// 			'Revert': function () {
	// 				this.storage ({
	// 					player: {
	// 						name: ''
	// 					}
	// 				});
	// 			},
	// 			'Warning': 'You must enter a name!'
	// 		}
	// 	},
	// 	'y Hi {{player.name}} Welcome to Monogatari!',
	// 	{
	// 		'Choice': {
	// 			'Dialog': 'y Have you already read some documentation?',
	// 			'Yes': {
	// 				'Text': 'Yes',
	// 				'Do': 'jump Yes'
	// 			},
	// 			'No': {
	// 				'Text': 'No',
	// 				'Do': 'jump No'
	// 			}
	// 		}
	// 	}
	// ],

	// 'Yes': [
	// 	'y Thats awesome!',
	// 	'y Then you are ready to go ahead and create an amazing Game!',
	// 	'y I can’t wait to see what story you’ll tell!',
	// 	'end'
	// ],

	// 'No': [

	// 	'y You can do it now.',

	// 	'show message Help',

	// 	'y Go ahead and create an amazing Game!',
	// 	'y I can’t wait to see what story you’ll tell!',
	// 	'end'
	// ]
});
