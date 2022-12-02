const cellSize = 5,
fr = 60,
seed = 2,
t=1,
maxSand = 1000000,
sides = [[0,-1],[1,0],[0,1],[-1,0]]

let grid = [],
nGrid = [],
cs = [],
p=0,
c = 1,
clen = 0,
delay=1/2.8,
sd = 2,
tp = 0,
w,h,hc,wc,
basicOrder = [2,1,0,3,4,5,6,7]




//types vert,r,glide,
//let types = [['vert'],[[0,1],[0,-1],[-1,0],[1,-1]],[[0,1],[0,-1],[-1,-1],[-2,0]]]



function setup() {
	w = windowWidth
	h = windowHeight
	hc = floor(h / cellSize)
	wc = floor(w / cellSize)
	createCanvas(w,h)
	noStroke()
	background(100,101,134);
	frameRate(fr)
	grid = ran(400,wc,hc)
	//grid = clr(wc,hc)
	grid[floor(wc/2)][floor(hc/2)] = maxSand
	grid[floor(wc/2) + 8][floor(hc/2)] = maxSand
 	grid[floor(wc/2)+4][floor(hc/2)-8] = maxSand
	cs = popCols(maxSand)
}


const popCols = (num)=>{
	const newCols =[]
	for(let c = 0; c <= num;c++){newCols.push([floor(random(255)),floor(random(255)),floor(random(255))])}
//console.log('col',newCols)
	return newCols
}

function touchStarted(){

}

const ran = (ranMax,x,y)=>{
	let arr = []
	for(let i = 0; i < x; i++){
		arr.push([])
		for(let j = 0; j < y; j++) {
			arr[i].push(floor(random(ranMax)))
		}
	}
	return arr
}


const clr = (x,y)=>{
	const arr = []
	for(let i = 0; i < x; i++){
		arr.push([])
		for(let j = 0; j < y; j++) {
			arr[i].push(0)
		}
	}
	return arr
}

const next = ()=>{ 
	nGrid = clr(wc,hc)
	grid.forEach((row,i)=>{
		row.forEach((cell,j)=>{
			if(grid[i][j] + nGrid[i][j] > 0) spread6(i,j,basicOrder)
		})
	})	
	updateGrid()
}

const updateGrid = ()=>{
	grid.forEach((row,i)=>{
		row.forEach((cell,j)=>{
			grid[i][j] += nGrid[i][j]
		})
	})
}

const spread6 = (x,y)=>{
	if(grid[x][y] >= 4){
		sides.forEach(s=>{
			//if(x==wc/2&&y==hc/2) console.log("hey",s)
			let i = s[0]
			let j = s[1]
			let ngs = [(x+i+wc)%wc,(y+j+hc)%hc]
			if(grid[x][y] -1 > grid[ngs[0]][ngs[1]]){
				//if(x==wc/2&&y==hc/2) console.log("no",frameCount,x,y)
				nGrid[x][y]--
				nGrid[ngs[0]][ngs[1]]++
				if(x == floor(wc / 2) && y == floor(hc / 2)) console.log("no",frameCount, nGrid[x][y])
			}
		})
	}
}

const spread5 = (x,y)=>{
	if(grid[x][y] >= 4){
		sides.forEach(s=>{
			const i = s[0], j = s[1], ngs = [(x+i+wc)%wc,(y+j+hc)%hc]
			if(grid[x][y] > grid[ngs[0]][ngs[1]] + 1){
				nGrid[x][y]--
				nGrid[ngs[0]][ngs[1]]++
			}
		})
	}
}

const spread4 = (x,y)=>{
	if(grid[x][y] >= 4){
		sides.forEach(s=>{
			const i = s[0], j = s[1], ngs = [(x+i+wc)%wc,(y+j+hc)%hc]
			if(grid[x][y] > grid[ngs[0]][ngs[1]]){
				nGrid[x][y]--
				nGrid[ngs[0]][ngs[1]]++
			}
		})
	}
}

const spread3 = (x,y)=>{
	const cell = grid[x][y]
	if(cell+nGrid[x][y] > 4){
		//nGrid[x][y] -= 0
		for(let i=-1; i<2; i++){
			for(let j=-1; j<2; j++){
				if(i==0 && j==0) continue
				if(grid[x][y]+nGrid[x][y]>grid[(x+i+wc)%wc][(y+j+hc)%hc]){
					nGrid[x][y]--
					nGrid[(x+i+wc)%wc][(y+j+hc)%hc]++
				}
			}
		}
	}
}

const spread2 = (i,j,order)=>{
	const newOrder = []
	for(let k = 0; k < 8; k++){
		newOrder.push(floor(random(8)))
	}

	newOrder.forEach((index)=>{
		if(grid[i][j] + nGrid[i][j] > 1){
			const {a,b} = indexedCell(index) 
			updateNGrid(i,j,i+a,j+b)
		}
	})
}

const spread = (i,j,order)=>{
	order.forEach((index)=>{
		if(grid[i][j] + nGrid[i][j] > 1){
			const {a,b} = indexedCell(index) 
			updateNGrid(i,j,i+a,j+b)
		}
	})
}

const indexedCell = (index)=>{
	//console.log("ic index",index)
	let counter = 0
	for(let i=-1; i<2; i++){
		for(let j=-1; j<2; j++){
			if(i==0 && j==0) continue
			if(counter == index) return {'a':i,'b':j}
			else counter++
		}
	}
}

const updateNGrid = (x,y,i,j)=>{
	if(grid[x][y] + nGrid[x][y] > nGrid[(i+wc)%wc][(j+hc)%hc]){
		nGrid[x][y]--
		nGrid[(i+wc)%wc][(j+hc)%hc]++
		return
	}
//	console.log('ng updatedfailed', x,y,i,j)
}

const correctColor = (amt, maxSand) =>{
	const val = amt/maxSand
	if (val < 1/3) return [((1/3)-val)*3*255,(val)*255,0] 
	if (val < 2/3) return [0,((2/3)-val)*3*255, (val - 1/3)*255]
	if (val <= 3/3) return [(val-2/3)*255,0,(1-val)*3*255]
}

const correctColor2 = (amt, maxSand) =>{
	const val = amt/maxSand
	if (val < 1/3) return [255,0,0] 
	if (val < 2/3) return [0,255,0]
	if (val <= 3/3) return [0,0,255]
}

const correctColor3 = (amt) =>{
	return [cs[amt][0],cs[amt][1],cs[amt][2]]
}

const correctColor4 = (amt) =>{
	return (amt>3?[255,255,255]:(amt>2?[255,0,0]:(amt>1?[0,0,255]:(amt>0?[0,255,0]:[0,0,0]))))
}

const show = ()=>{
	//if(t != 1 && frameCount % t == 0){p=(p+1)%clen}
	grid.forEach((row,i)=>{
		row.forEach((cell,j)=>{
			if(cell == 0) fill(0)
			else{
				let cs2 = correctColor3(cell,maxSand + 2)
				fill(cs2)
				rect(i*cellSize,j*cellSize,cellSize)
				//fill(255)
				//textSize(8)
				//text(cell,i*cellSize,j*cellSize+(cellSize/2))
			}
		
		})
	})
	
}
 
function draw(){
	background(0)
	show()
	for(let i = 0; i< 10; i++)next()
//next()
}
