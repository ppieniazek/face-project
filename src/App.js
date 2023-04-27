import ParticlesBg from 'particles-bg';
import { Component } from 'react';
import './App.css';
import FaceRecognition from './components/face-recognition/FaceRecognition';
import ImageLinkForm from './components/image-link-form/ImageLinkForm';
import Logo from './components/logo/Logo';
import Navigation from './components/navigation/Navigation';
import Rank from './components/rank/Rank';
import Register from './components/register/Register';
import SignIn from './components/sign-in/SignIn';

const setupClarifai = imageUrl => {
	const PAT = '3288cf2810c944b6853b362bb3020205';
	const USER_ID = 'ppieniazek';
	const APP_ID = 'test';
	// const MODEL_ID = 'face-detection';
	const IMAGE_URL = imageUrl;

	const raw = JSON.stringify({
		user_app_id: {
			user_id: USER_ID,
			app_id: APP_ID,
		},
		inputs: [
			{
				data: {
					image: {
						url: IMAGE_URL,
					},
				},
			},
		],
	});

	const requestOptions = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: `Key ${PAT}`,
		},
		body: raw,
	};

	return requestOptions;
};
class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
			route: 'signin',
			isSignedIn: false,
		};
	}

	calculateFaceLocation = data => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height),
		};
	};

	displayFaceBox = box => {
		this.setState({ box });
	};

	onInputChange = event => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = () => {
		this.setState(prevState => ({ imageUrl: prevState.input }));
		const { input } = this.state;
		const MODEL_ID = 'face-detection';
		fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, setupClarifai(input))
			.then(response => response.json())
			.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
			.catch(err => console.log(err));
	};

	onRouteChange = route => {
		if (route === 'signout') {
			this.setState({ isSignedIn: false });
		} else if (route === 'home') {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route });
	};

	render() {
		const {
			isSignedIn, imageUrl, route, box,
		} = this.state;
		return (
			<div className="App">
				<Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
				{

					route === 'home'
						? (
							<>
								<Logo />
								<Rank />
								<ImageLinkForm
									onInputChange={this.onInputChange}
									onButtonSubmit={this.onButtonSubmit}
								/>
								<FaceRecognition box={box} imageUrl={imageUrl} />
							</>
						)
						: (route === 'signin'
							? <SignIn onRouteChange={this.onRouteChange} />
							: <Register onRouteChange={this.onRouteChange} />)
				}
				<ParticlesBg type="square" bg />
			</div>
		);
	}
}

export default App;
