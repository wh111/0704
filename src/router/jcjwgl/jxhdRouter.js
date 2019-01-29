const jxhdRouters = {
  path: 'jxhd',
  name: 'jxhd',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'jxhd');
  },
  redirect: to => {
    return '/index/jxhd/jxj' 
  },
  children:[{
    path:'kcb',
    name:'kcb',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('@/components/jcjwgl/jxhd/kcb.vue'));
      }, 'jxhd');
    }    
  },{
    path:'hdset',
    name:'hdset',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('@/components/jcjwgl/jxhd/hdset.vue'));
      }, 'jxhd');
    }    
  }
  ]
}

export default jxhdRouters;