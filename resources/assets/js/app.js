import Vue from './vue';

const Child = {
    template: '<div>A custom component!</div>'
};

new Vue({
    el: '#app',
    components: {
        'my-component': Child
    },
    data: {
        show_sidebar: false,
        showAlerts: true,
        nav3: false,
        dropdown_items: [
            {title: 'title1'},
            {title: 'title2'},
            {title: 'title3'},
            {title: 'title4'}
        ]
    }
});
