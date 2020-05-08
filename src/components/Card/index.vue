<template>
	<div class="card"
        :class="{
            
        }"
    >
		<div class="title">{{ mTitle }}</div>
		<div class="content">{{ mContent }}</div>
        <div class="actions">
            <button @click="onUpdateCard">更新</button>
        </div>
	</div>
</template>

<script>
import http from "axios"

export default {
	name: "Card",
	props: {
		title: { type: String, default: "卡片标题" },
		content: { type: String, default: "卡片内容" }
    },
    data(){
        return {
            mTitle:this.title,
            mContent:this.content
        }
    },
    methods:{
        async onUpdateCard(){
            let { data } = await http.request({url:"/api/getCard"})
            this.mTitle=data.title
            this.mContent=data.content
            this.$emit('update',new Date().getTime())
        }
    }
};
</script>

<style scoped lang="scss">
.card {
	border: 1px solid rgb(207, 206, 206);
	border-radius: 4px;
    width: 300px;
	& > .title {
		background: #ebe8e8;
		font-size: 1.1em;
		font-weight: bold;
		border-bottom: 1px solid rgb(207, 206, 206);
        padding:4px;
	}
	& > .content {
		font-size: 10px;
        padding: 2em;
	}
    &>.actions{
        padding:4px;
        border-top: 1px solid rgb(207, 206, 206);
        text-align: right;
        &>button{
            cursor: pointer;
        }
    }
}
</style>
