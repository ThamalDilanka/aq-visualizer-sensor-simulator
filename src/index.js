const Axios = require('axios');

const sensorId = 'aqvisualizersensor100';

const proxy = 'https://aq-visualizer.herokuapp.com/';
const endpointAddReading = `${proxy}api/v1/sensorReadings/${sensorId}`;
const endpointUpdateSensor = `${proxy}api/v1/sensors/${sensorId}`;

const sliderSmoke = document.getElementById('smokeLevel');
const sliderCo2 = document.getElementById('co2Level');
const outputSmoke = document.getElementById('smokeLevelIndicator');
const outputCo2 = document.getElementById('co2LevelIndicator');
const toggleSwitch = document.getElementById('toggleSwitch');
const statusIndicator = document.getElementById('statusIndicator');
const displayImage = document.getElementById('display-image');

let smokeLevel = 5,
	co2Level = 5,
	readingCount = 0;

outputSmoke.innerHTML = sliderSmoke.value;
outputCo2.innerHTML = sliderCo2.value;

sliderSmoke.oninput = function () {
	outputSmoke.innerHTML = this.value;
	smokeLevel = this.value;
};
sliderCo2.oninput = function () {
	outputCo2.innerHTML = this.value;
	co2Level = this.value;
};

toggleSwitch.addEventListener('change', () => {
	if (toggleSwitch.checked) {
		statusIndicator.innerHTML = 'Activated';
		statusIndicator.className = 'statusIndicator-active';
		updateSensorStatus(true);
		displayImage.src = 'loading-ripple.gif';
	} else {
		statusIndicator.innerHTML = 'Disabled';
		statusIndicator.className = 'statusIndicator-deactive';
		displayImage.src = 'disconnect.png';
		updateSensorStatus(false);
	}
	readingCount = 0;
});

postSensorReading = () => {
	Axios.post(endpointAddReading, {
		sensor: sensorId,
		reading: {
			smokeLevel: smokeLevel,
			co2Level: co2Level,
		},
	}).then((res) => {
		readingCount++;
		console.log(res);
	});
};

updateSensorStatus = (status) => {
	Axios.patch(endpointUpdateSensor, {
		sensor: sensorId,
		reading: {
			activated: status,
		},
	}).then((res) => {
		console.log(res);
	});
};

setInterval(function () {
	if (toggleSwitch.checked) {
		postSensorReading();
	}
}, 5000);
