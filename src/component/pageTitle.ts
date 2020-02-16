let previousWhich = null;

/**
 * page switch
 * 
 * @param {string} which  button ID
 */
export const pageTitle = (which: string): void => {
	if (previousWhich != null)
		document.getElementById(previousWhich).style.background = '';

	document.getElementById(which).style.background = '#424242';
	previousWhich = which;
};
