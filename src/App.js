import ParticlesBg from 'particles-bg';
import './App.css';
import ImageLinkForm from './components/image-link-form/ImageLinkForm';
import Logo from './components/logo/Logo';
import Navigation from './components/navigation/Navigation';
import Rank from './components/rank/Rank';

function App() {
	return (
		<div className="App">
			<Navigation />
			<Logo />
			<Rank />
			<ImageLinkForm />
			{/* <FaceRecognition /> */}
			<ParticlesBg type="square" bg />
		</div>
	);
}

export default App;
