<template>
    <div class="fd-wrap">
      <ul>
        <li
          v-for="(item, index) in list"
          :key="index"
          class="">{{item}}</li>
      </ul>
      <el-button
        type="primary"
        plain
        @click="addClickHandler">添加</el-button>
    </div>
</template>

<script>
import Vue from 'vue';
import {Button} from 'element-ui';
Vue.component('el-button', Button);
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data() {
        return {
            list: [1, 2, 3, 4, 5]
        };
    },
    methods: {

        /**
         * 增加列表点击事件
         * @return {!number} null
         */
        addClickHandler() {
            this.list.push(this.list.length + 1);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
