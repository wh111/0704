const rcglRouters = {
  path: 'rcgl',
  name: 'rcgl',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'rcgl');
  },
  redirect: to => {
    return '/index/rcgl/jxj' 
  },
  children:[{
    path:'jxj',
    name:'jxj',
    component:resolve=> {
      require.ensure([], () => {
       // resolve(require('@/components/jcjwgl/rcgl/jxj.vue'));
        resolve(require('@/components/common/tabletpl.vue'));
      }, 'rcgl');
    }    
  },{
    path:'py',
    name:'py',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('@/components/jcjwgl/rcgl/py.vue'));
      }, 'rcgl');
    }    
  },{
    path:'jt',
    name:'jt',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('@/components/jcjwgl/rcgl/jt.vue'));
      }, 'rcgl');
    }    
  }
  ]
}

export default rcglRouters;