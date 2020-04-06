const fs = require('fs');
function KeyStore(file, namespace) {
	if (!new.target) { // if you run me without new
		throw new Error('Please call this with the new operator.');
	}
	if (!file) { // if you run me without new
		throw new Error('Missing file to read/write');
	}
	if (!namespace) { // if you run me without new
		throw new Error('Missing namespace for current instance of KeyStore');
	}
	function isJson(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
	function setItem(key, value) {
		var data = fs.readFileSync(file);
		var dataParsed;
		if (!isJson(data)) {
			dataParsed = {};
		}
		else {
			dataParsed = JSON.parse(data);
		}
		if (!dataParsed[namespace]) dataParsed[namespace] = {};
		dataParsed[namespace][key] = value;
		fs.writeFileSync(file, JSON.stringify(dataParsed));
		return true;
	}
	function getItem(key) {
		var dataParsed;
		var data = fs.readFileSync(file);
		if (!isJson(data)) {
			dataParsed = {};
		}
		else {
			dataParsed = JSON.parse(data);
		}
		return dataParsed[namespace][key];
	}
	function delItem(key) {
		return setItem(key, undefined);
	}
	function clearNamespace() {
		var data = fs.readFileSync(file);
		var dataParsed;
		if (!isJson(data)) {
			dataParsed = {};
		}
		else {
			dataParsed = JSON.parse(data);
		}
		dataParsed[namespace] = undefined;
		fs.writeFileSync(file, JSON.stringify(dataParsed));
		return true;
	}
	this.set = setItem;
	this.get = getItem;
	this.delete = delItem;
	this.clear = clearNamespace;
	return this;
}
exports.KeyStore = KeyStore;