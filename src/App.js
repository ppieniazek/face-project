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

const initialState = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
};

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined
			}
		});
	};

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
		const { input, user } = this.state;
		const { id } = this.state.user;
		this.setState({ imageUrl: input });
		fetch('http://localhost:3000/imageurl', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				input
			})
		})
			.then(response => response.json())
			.then(response => {
				if (response) {
					fetch('http://localhost:3000/image', {
						method: 'put',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							id
						})
					})
						.then(response => response.json())
						.then(count => {
							this.setState(Object.assign(user, { entries: count }));
						})
						.catch(console.log);
				}
				this.displayFaceBox(this.calculateFaceLocation(response));
			})
			.catch(err => console.log(err));
	};

	onRouteChange = route => {
		if (route === 'signout') {
			this.setState(initialState);
		} else if (route === 'home') {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route });
	};

	render() {
		const { isSignedIn, imageUrl, route, box } = this.state;
		const { name, entries } = this.state.user;
		return (
			<div className="App">
				<Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
				{
					route === 'home'
						? (
							<>
								<Logo />
								<Rank name={name} entries={entries} />
								<ImageLinkForm
									onInputChange={this.onInputChange}
									onButtonSubmit={this.onButtonSubmit}
								/>
								<FaceRecognition box={box} imageUrl={imageUrl} />
							</>
						)
						: (route === 'signin'
							? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
							: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />)
				}
				<ParticlesBg type="square" bg />
			</div>
		);
	}
}

export default App;
