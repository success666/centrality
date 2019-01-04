var mixin = {
    methods: {
        loading: function (self) {
            return self.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        },
        viewImage: function (self,event) {
            self.height = self.$refs.img.height;
            self.width = self.$refs.img.width;

            let originalHeight = self.$refs.img.height;
            let originalWidth = self.$refs.img.width;

            if(self.height>=document.documentElement.clientHeight-114){
                self.height = document.documentElement.clientHeight-120
                self.width = self.height/originalHeight*self.width
            }

            if(self.width>=document.documentElement.clientWidth-60){
                self.width = document.documentElement.clientWidth-60
                self.height = self.width/originalWidth*self.height
            }

            if(originalHeight>=document.documentElement.clientHeight*4){
                self.height = originalHeight
                self.width = originalWidth
            }else if(originalWidth>=document.documentElement.originalWidth*4){
                self.height = originalHeight
                self.width = originalWidth
            }
            self.dialogVisible = true;
            self.url = event.target.src;
        },
        arrayToString(data){
            let str = '';
            for(let key of data){
                str += key+','
            }
            return str.slice(0,-1); 
        }
    }
}

export default mixin;