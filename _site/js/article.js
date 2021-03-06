/**
 * 一个标题信息对象
 * @param {string} text 标题文本内容
 * @param {number} level 标题级别1-6
 */
function Title(text, id, level) {
  this.text = text
  this.id = id
  this.level = level
  this.children = []
}

// 标题树单例
var tree = {
  text: '目录',
  id: '',
  level: 0,
  children: [],
  insert: function(title) {
    var parent = tree
    // 找到待插入标题的父节点(需要注意hn中n越大层级越深)
    while (title.level - parent.level > 1) {
      var children = parent.children
      if (children.length === 0) {
        children.push(new Title('(空)', '#', parent.level + 1))
      }
      parent = children[children.length - 1]
    }
    // 将待插入节点作为最后一个子节点
    parent.children.push(title)
  }
}

Vue.component('blog-catalog', {
  template: `<div class="title-wrapper">
			<p class="title" :class="cls" v-if="treeNode.text" @click.stop.self="toggleChildren">
				<span class="expand-controller" :class="status"  v-html="sign" @click.stop="toggleChildren"></span >
				<a class="title-link" :href="href" :data-level="treeNode.level">{{ treeNode.text }}</a>
			</p>
			<div class="children" v-show="hasChildren && isShowChildren">
				<blog-catalog v-for="node in treeNode.children" :tree-node="node" :expand-level="expandLevel" :key="node.text"></blog-catalog>
			</div >
			</div >`,
  props: ['treeNode', 'expandLevel'],
  data: function() {
    return {
      isShowChildren: true
    }
  },
  created: function() {
    this.freshAll()
  },
  watch: {
    expandLevel: function() {
      this.freshAll()
    }
  },
  computed: {
    cls: function() {
      return 'title' + this.treeNode.level
    },
    href: function() {
      return '#' + this.treeNode.id
    },
    hasChildren: function() {
      return !!this.treeNode.children && this.treeNode.children.length > 0
    },
    status: function() {
      return !this.hasChildren
        ? 'single'
        : this.isShowChildren
        ? 'open'
        : 'closed'
    },
    sign: function() {
      var controlStrMap = {
        single: '&nbsp;',
        closed: '+',
        open: '-'
      }
      return controlStrMap[this.status]
    }
  },
  methods: {
    freshAll: function() {
      // 根据展开级别修改是否显示本组件及其children包含块
      var v1 = this.treeNode.level,
        v2 = this.expandLevel
      this.isShowChildren = v1 + 1 <= v2
    },
    toggleChildren: function() {
      if (this.hasChildren) {
        this.isShowChildren = !this.isShowChildren
      }
    }
  }
})

new Vue({
  el: '#app',
  data: {
    tree: tree,
    expandLevel: 1,
    minLevel: 1,
    maxLevel: 1,
    isShowSidebar: true,
    isNarrowScreen: false
  },
  created: function() {
    // test if is narrow screen
    var width = window.innerWidth
    if (width < 720) {
      this.isNarrowScreen = true
      // hide sidebar for narrow screen defautly
      this.hideSidebar()
    }
  },
  mounted: function() {
    this.gatherTitles()
  },
  methods: {
    gatherTitles: function() {
      var post = this.$refs.post,
        hReg = /^[hH]\d$/
      var postChild = post.firstChild
      while (postChild !== null) {
        /*check the post element's children*/
        var name = postChild.nodeName
        if (hReg.test(name)) {
          var level = +name.charAt(1),
            text = postChild.innerHTML,
            id = postChild.id
          if (level > this.maxLevel) this.maxLevel = level
          this.tree.insert(new Title(text, id, level))
        }
        postChild = postChild.nextSibling
      }
    },
    modifyLevel: function(inc) {
      var newLevel = this.expandLevel + inc
      if (newLevel >= this.minLevel && newLevel <= this.maxLevel) {
        this.expandLevel = newLevel
      }
    },
    hideSidebar: function() {
      this.isShowSidebar = false
    }
  }
})
