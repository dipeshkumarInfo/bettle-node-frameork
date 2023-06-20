function checkedAllMatchedValues (arrayToMatch, MatchingAttribute) {
    const checkboxList = document.querySelectorAll('input[type="checkbox"].check');
    checkboxList.forEach((checkbox) => {
      const checkboxValue = checkbox.getAttribute(MatchingAttribute);
      if (arrayToMatch.split(",").includes(checkboxValue)) {
        checkbox.checked = true;
      }
    });
  }