class Solver 
{   

    constructor()
    {
        let boardToPrint = "";
        let style1 = "border-right-width: 2px;border-right-color: black;width:47px;";
        let style2 = "border-bottom-width: 2px;border-bottom-color: black;height:47px;";
        for(let i=0; i<9; ++i){
            for(let j=0; j<9; ++j){
                boardToPrint += `<div id='cell_${i}-${j}' class='cell' onclick="solver.focus(${i},${j})"
                    style="${[2,5].includes(j)?style1:''}${[2,5].includes(i)?style2:''}"></div>`;
            }
        }
    
        document.getElementById('board').innerHTML = boardToPrint;
        this.focusCell = [-1,-1];
        this.board = [];
        this.board2 = [];

        for(let i=0; i<9;i++)
        {
            this.board.push([-1,-1,-1,-1,-1,-1,-1,-1,-1]);
        }
        document.onkeydown = (e)=>{this.handleKeyDown(e)};
    }

    focus(i,j){
        if(!this.focusCell.includes(-1)) document.getElementById(`cell_${this.focusCell[0]}-${this.focusCell[1]}`).style.backgroundColor = 'white'
        this.focusCell = [i,j];
        if(![i,j].includes(-1)) document.getElementById(`cell_${i}-${j}`).style.backgroundColor = 'grey'
    }

    focusNext(){
        if(this.focusCell.includes(-1)) return
        if(this.focusCell[0] === 8 && this.focusCell[1] === 8) return
        if(this.focusCell[1] === 8) this.focus(this.focusCell[0]+1,0)
        else this.focus(this.focusCell[0],this.focusCell[1]+1)
    }

    focusPrev(){
        if(this.focusCell.includes(-1)) return
        if(this.focusCell[0] === 0 && this.focusCell[1] ===0) return
        if(this.focusCell[1] === 0) this.focus(this.focusCell[0]-1,8)
        else this.focus(this.focusCell[0],this.focusCell[1]-1)
    }

    solve()
    {
        document.onkeydown = null;
        for(let i in this.board)
        {
            i = parseInt(i)
            for(let j in this.board[i]){
                j = parseInt(j)
                if(this.board[i][j] === -1)
                {
                    this.board[i][j] = this.getPossibleNumbers(i,j);
                }
            }
        }
        while(this.fillinBoard()){}
        this.printResult()
    }

    fillinBoard(){
        for(let i in this.board){
            i = parseInt(i);
            for(let j in this.board){
                j = parseInt(j)
                if(typeof(this.board[i][j]) === 'object')
                {
                    if(this.board[i][j].length === 0){
                        if(this.board2.length === 0){
                            alert('cannot solve this board');
                            return 0;
                        }
                        this.board = this.board2[this.board2.length-1];
                        this.board2.pop();
                        return -1;
                    }
                    if(this.board[i][j].length === 1){
                        this.board[i][j] = this.board[i][j][0];
                        this.removePossibleNumbers(i,j);
                        return 1;
                    }
                }
            }
        }
        for(let i in this.board){
            i = parseInt(i);
            for(let j in this.board){
                j = parseInt(j)
                if(typeof(this.board[i][j]) === 'object')
                {
                    let tmp = JSON.parse(JSON.stringify(this.board));
                    tmp[i][j].splice(0,1);
                    this.board2.push(tmp);
                    this.board[i][j] = this.board[i][j][0];
                    this.removePossibleNumbers(i,j);
                    return 1;
                }
            }
        }
        return 0;
    }

    getPossibleNumbers(i,j)
    {
        let possibleNumbers = 
        [
            true, true, true, true, true, true, true, true, true
        ]
        for(let index in this.board){
            index = parseInt(index)
            if([1,2,3,4,5,6,7,8,9].includes(this.board[i][index]))
            {
                possibleNumbers[this.board[i][index]-1] = false;
            }
            if([1,2,3,4,5,6,7,8,9].includes(this.board[index][j]))
            {
                possibleNumbers[this.board[index][j]-1] = false;
            }
            if([1,2,3,4,5,6,7,8,9].includes(this.board[parseInt(i/3)*3+parseInt(index/3)][parseInt(j/3)*3+index%3])){
                possibleNumbers[this.board[parseInt(i/3)*3+parseInt(index/3)][parseInt(j/3)*3+index%3]-1] = false;
            }
        }
        let tmp = []
        for(let val in possibleNumbers) if(possibleNumbers[val]) tmp.push(parseInt(val)+1);
        return tmp;
    }

    removePossibleNumbers(i,j)
    {
        let val = this.board[i][j];
        for(let index in this.board){
            index = parseInt(index)
            if(typeof(this.board[i][index]) === 'object')
            {
                this.removeFromArr(this.board[i][index], val);
            }
            if(typeof(this.board[index][j]) === 'object')
            {
                this.removeFromArr(this.board[index][j], val);
            }
            if(typeof(this.board[parseInt(i/3)*3+parseInt(index/3)][parseInt(j/3)*3+index%3]) === 'object'){
                this.removeFromArr(this.board[parseInt(i/3)*3+parseInt(index/3)][parseInt(j/3)*3+index%3], val);
            }
        }
    }
    removeFromArr(arr,val)
    {
        for(let i in arr){
            if(arr[i] === val)
            {
                arr.splice(i,1);
                return
            }
        }
    }

    handleKeyDown(e)
    {
        if(this.focusCell.includes(-1)) return;
        if(e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105)
        {
            this.board[this.focusCell[0]][this.focusCell[1]] = parseInt(e.key);
            document.getElementById(`cell_${this.focusCell[0]}-${this.focusCell[1]}`).innerHTML = `<span style='color:blue;'>${e.key}</span>`;
            this.focusNext();
            return;
        }
        if(e.keyCode === 8){
            this.board[this.focusCell[0]][this.focusCell[1]] = -1;
            document.getElementById(`cell_${this.focusCell[0]}-${this.focusCell[1]}`).innerHTML = '';
            this.focusPrev();
            return;
        }
        this.focusNext()
    }

    printResult()
    {
        for(let i in this.board){
            for(let j in this.board[i]){
                if(typeof(this.board[i][j]) === 'object') continue;
                if(document.getElementById(`cell_${i}-${j}`).innerHTML !== '') continue;
                document.getElementById(`cell_${i}-${j}`).innerHTML = this.board[i][j];
            }
        }
    }

}

function reset()
{
    document.onkeydown = null;
    return new Solver();
}

var solver = new Solver();