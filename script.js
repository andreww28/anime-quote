//https://twitter.com/intent/tweet?text=Hello%20world
var anime_list = []

const Main = function(){
    const popup1 = document.querySelector('.popup1');
    const quote_node = document.querySelector('#quote');
    const character_node = document.querySelector('#character');

    function show_popup(){
        popup1.style.display = 'block';
        popup_display_anime(anime_list);
    }

    function popup_display_anime(anime_list){
        const parent = document.querySelector('.popup-content ul');
        anime_list = anime_list.map(anime => anime.toLowerCase()).sort();
        let content = ``;
    
        anime_list.forEach(anime => {
            content += `<li>${anime}</li>`;
        })
    
        parent.innerHTML = content;
    }

    function update_anime_list(e){
        let val = e.target.value.toLowerCase().replace(/\s/, '');
        let new_list;
    
        if(val === ''){
            new_list = anime_list;
        }else{
            new_list = anime_list.filter(anime => anime.toLowerCase().replace(/\s/, '').includes(val));
            if(new_list.length === 0){
                new_list = [`${val} is not available.`]
            }
        }
        popup_display_anime(new_list);
    }

    function display_text(data_obj){
        quote_node.textContent = `"${data_obj.quote}"`;
        character_node.innerHTML = `<p id="character"><em>- ${data_obj.character} <span id="anime-title-quote">(${data_obj.anime})</span></em></p>`;
    }

    function tweet_it(){
        let quote = quote_node.textContent;
        const anime_title =     document.querySelector('#anime-title-quote').textContent;
        const author = document.querySelector('#person').textContent;
        let temp = `${quote}\n  ~${author} ${anime_title}`;
        let value = temp.replace(' ', '%20').replace('\n', '%0A');
        window.open(`https://twitter.com/intent/tweet?text=${value}`, 'blank');
    }

    return {
        show_popup,
        update_anime_list,
        display_text,
        tweet_it,
    }
};


const Data = function () {
    let main = Main();
    let data_quote;

    function get_available_anime(){
        fetch('https://animechan.vercel.app/api/available/anime')
          .then(response => response.json())
          .then(anime => anime.forEach(l => anime_list.push(l)))
    }
    
    
    function get_quote_data(url){
        fetch(url)
          .then(response => response.json())
          .then(anime => {
              data_quote = anime[~~(Math.random() * anime.length)];
              main.display_text(data_quote);
            });
    }

    return {
        get_available_anime,
        get_quote_data
    }
};



(function () {
    const avail_anime_btn = document.querySelector('#available-anime');
    const char_btn = document.querySelector('#char-btn');
    const popup1 = document.querySelector('.popup1')
    const popup2 = document.querySelector('.popup2')


    const close_btn = document.querySelector('.close-icon1')
    const close_btn2 = document.querySelector('.close-icon2')
    const anime_search = document.querySelector('.popup-content > input')
    const tweet_btn = document.querySelector('.btn-tweet');

    const random_btn = document.querySelector('#random-btn');

    let url_link = {
        random: "https://animechan.vercel.app/api/quotes",
        title: "https://animechan.vercel.app/api/quotes/anime?title=",
        character: "https://animechan.vercel.app/api/quotes/character?name="
    }
    const main = Main();
    const data = Data() 
    data.get_available_anime();
    //data.get_quote_data(url_link.character + 'luffy');


    avail_anime_btn.addEventListener('click', main.show_popup);
    char_btn.addEventListener('click', () => popup2.style.display = 'block');
    close_btn.addEventListener('click', () => popup1.style.display = 'none');
    close_btn2.addEventListener('click', () => popup2.style.display = 'none');
    anime_search.addEventListener('keyup', main.update_anime_list.bind(event));

    random_btn.addEventListener('click', data.get_quote_data.bind(event, url_link.random));
    tweet_btn.addEventListener('click', main.tweet_it);
})();

