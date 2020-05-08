import Vue from 'vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { text, object, boolean, number, select } from '@storybook/addon-knobs';

import Card from '../src/components/Card/index.vue';
import CardReadme from "../src/components/Card/readme.md"
 
export default {
	title: '卡片演示',
	component: Card,
    decorators: [ 
        
    ],          
	parameters: {
         
    }
};

let cardProps={
    title: "提示Tips",
    content:"来了老弟！自定义内容哦！"
}
export const CardStory = () => ({
    components: { Card },
    template:`<card :title='title' :content='content' @update='onUpdate'></card>`,
    methods: {
        onUpdate:action('update')
    },
    props:{
        title: {default:text("卡片标题",cardProps.title,"")},
        content:{default:text("卡片内容",cardProps.content,"")}
    }
})
CardStory.story = {
    name: '卡片',
    parameters: {
        notes: {
            CardReadme
        }
    }
};
