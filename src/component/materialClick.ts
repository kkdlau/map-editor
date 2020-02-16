let previousWhich = null;

/**
 * @param {string} which  button ID
 */
export const materialClick = (which: string): void => {
	if (previousWhich != null)
		document.getElementById(previousWhich).style.boxShadow = '';

	document.getElementById(which).style.boxShadow = '0px 0px 5px 2.5px #ffffff';
	previousWhich = which;
}
