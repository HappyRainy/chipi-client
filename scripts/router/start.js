export default function (router) {
    const { results } = router.data;

    fetch('api/suggestions.json')
        .then(res => res.json())
        .then(data => results.innerHTML = renderSuggestions(data))
}

function renderSuggestions(suggestions) {
    return suggestions.map(suggestion => 
        `<li><chipi-suggestion tabindex="0">${suggestion}</chipi-suggestion></li>`
    ).join('');
}