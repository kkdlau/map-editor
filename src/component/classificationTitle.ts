let previousWhich = null;

/**
 * classification switch
 * 
 * @param {string} which  button ID
 */
export const classificationTitle = (which: string): void => {
	if (previousWhich != null)
		document.getElementById(previousWhich).style.background = '';

	document.getElementById(which).style.background = '#424242';
	previousWhich = which;
};