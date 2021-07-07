import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export function highlightSubstring(params/*, hash*/) {
  let [text, term, classNames] = params;
  let regex = new RegExp(`${term}`, 'ig');
  let matches = text.match(regex);
  let nonMatches = text.split(regex);
  let hightlighted = nonMatches.shift();
  for (let i=0; i < matches.length; i++) {
    let substring = `<span class="${classNames}">${matches[i]}</span>`;
    hightlighted = hightlighted.concat(substring);
    hightlighted = hightlighted.concat(nonMatches[i]);
  }
  return htmlSafe(hightlighted);

}

export default helper(highlightSubstring);
