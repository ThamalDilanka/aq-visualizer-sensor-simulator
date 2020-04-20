const Axios = require('axios');

const sensorId = 'cbeeb1d8-75dc-40d3-a0b5-e0ec3a82cd3b';

const proxy = 'https://fire-alert-solution.herokuapp.com/';
const endpointAddReading = `${proxy}api/v1/sensorReadings/${sensorId}`;
const endpointUpdateSensor = `${proxy}api/v1/sensors/${sensorId}`;

const sliderSmoke = document.getElementById('smokeLevel');
const sliderCo2 = document.getElementById('co2Level');
const outputSmoke = document.getElementById('smokeLevelIndicator');
const outputCo2 = document.getElementById('co2LevelIndicator');
const toggleSwitch = document.getElementById('toggleSwitch');
const statusIndicator = document.getElementById('statusIndicator');
const displayImage = document.getElementById('display-image');
const readingCountIndicator = document.getElementById('reading-count-value');
const sensorIdIndicator = document.getElementById('sensor-id');
const rippleImage = document.getElementById('display-ripple');

let smokeLevel = 5,
	co2Level = 5,
	readingCount = 0;

outputSmoke.innerHTML = sliderSmoke.value;
outputCo2.innerHTML = sliderCo2.value;

sensorIdIndicator.innerHTML = sensorId;

displayImage.ondragstart = () => {
	return false;
};

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
		rippleImage.style.visibility = 'visible';
		updateSensorStatus(true);
		displayImage.src = 'sensor-on.png';
	} else {
		statusIndicator.innerHTML = 'Disabled';
		statusIndicator.className = 'statusIndicator-deactive';
		rippleImage.style.visibility = 'hidden';
		displayImage.src = 'sensor-off.png';
		updateSensorStatus(false);
	}
	readingCount = 0;
	readingCountIndicator.innerHTML = readingCount;
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
		readingCountIndicator.innerHTML = readingCount;
		console.log(res);
	});
};

updateSensorStatus = (status) => {
	Axios.patch(endpointUpdateSensor, {
		activated: status,
	}).then((res) => {
		console.log(res);
	});
};

postSensorReading();
readingCountIndicator.innerHTML = readingCount;
setInterval(function () {
	if (toggleSwitch.checked) {
		postSensorReading();
		readingCountIndicator.innerHTML = readingCount;
	}
}, 30000);
