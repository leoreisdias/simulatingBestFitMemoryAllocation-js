// Tamanho do vetor; Numeração das posições; 
// Status de vazio ou ocupado(boolean); Localização e tamanho de espaços livres
const maxLenght = 32;
const totalStorage = [];
var storageStatus = [];
var refPoints = [];

//Inicia todas as funções criadas
start = () => {
    //Cria o vetor e suas numerações
    createStructure();
    
    //Carrega valores aleatórios ocupados
    autoLoad();
    
    //Atualiza espaços livres com tamanho, onde iniciam e onde terminam
    updateRefPoints();

    //Renderiza o estado da memoria atual
    render();
}

createStructure = () => {
    // Coloca todos valores como livres e numera as posições
    for( let i=0; i< maxLenght; i++){
        totalStorage[i] = i;
        storageStatus[i] = false;
    }
}

const autoLoad = () => {
    //Gera posições aleatórias para se ocupar a partir de função random()
    let memPosition =0;
    for(let i = 0; i < maxLenght; i++){
        memPosition++;
        let random = Math.floor(Math.random() * maxLenght);
        console.log(random);
        storageStatus[random] = true;
}
    //Ultima posição ocupada para indicar final de fita
    storageStatus[maxLenght-1] = true;
}

function updateRefPoints(){
    // refPoints é um vetor de objeto, com os elementos inicio, fim, e tamanho
    // Ou seja, onde começa os espaços livres, onde termina e o total de espaço
    let count = 0;
    let indexPoints = 0;
    refPoints = [];
    for(let i=0; i<maxLenght;i++){
        if(storageStatus[i] === false){
            count++;
        }
        //Fará a implementação do refPoints ao achar espaço ocupado após um ou mais livres
        else if(storageStatus[i] === true && count !==0){
            refPoints[indexPoints] = {
                ini: Math.abs(count-i)+1,
                fim: i,
                freeSpace: count
            };
            indexPoints++;
            count = 0;
        }
    }
    //Ordenar em ordem crescente pelo tamanho de espaço
    refPoints.sort(function(a,b) {
        return a.freeSpace < b.freeSpace ? -1 : a.freeSpace > b.freeSpace ? 1 : 0;
    });
}

const render = () => {
    //Joga a partir do JavaScript elementos de tabela na div do html
    //Caso o storageStatus em determinada posição for true, a celula da tabela será pintada
    //Se não, ficará em branco
    let indexMemory=0;
    let html = '<table cellpadding=0 cellspacing=0>';
        html += '<tr>'
        for(let column = 0; column < maxLenght; column++){
            if(storageStatus[column] === true){
                if(column === maxLenght-1){
                    html+= '<td style="background-color:black; color: white">';
                    html+="$$"
                    html+='</td>';
                }else{
                    html+= '<td style="background-color:red">';
                    html+=`${totalStorage[indexMemory]}`
                    html+='</td>';
                }
            }else{
                if(column === maxLenght-1){
                    html+= '<td>';
                    html+="$$";
                    html+='</td>';    
                }else{
                    html+= '<td>';
                    html+=`${totalStorage[indexMemory]}`
                    html+='</td>';
                }   
            }
            indexMemory++;
        }
        
        html += '</tr>'
    html += '</table>'

    document.querySelector('.tabela').innerHTML = html;
}
//Inicia todas funções ao carregar a página
start();
//------------------------------------------------------------------------

const search = () =>{
    //Pega o valor do Input, garante a conversão para númerico e utiliza
    const inputValue = Number(document.querySelector('input#memoryInput').value);

    //Apaga o campo do input ao pegar o valor anteriormente colocado
    document.querySelector('input#memoryInput').value = '';

    //Chama a função para alocar aquele espaço
    allocate(inputValue);

    //Atualiza novamente os pontos livres
    updateRefPoints();
    console.log(refPoints);
}

const allocate = (inputValue) => {
    //Com refPoints ordenado, vou buscar o menor elemento em que o valor digitado caiba
    //Ou seja, um valor >= do que foi digitado
    //O limite serve para buscar ao achar o espaço que será usado, alocar somente até o valor digitado
    let limit = 0;
    for(let i=0; i<refPoints.length;i++){
        if(refPoints[i].freeSpace >= inputValue){
            for(let j=refPoints[i].ini-1; j <= refPoints[i].fim; j++){
                storageStatus[j] = true;
                limit++;
                if(limit===inputValue) break;
            }
            break;
        }
    }
    //Caso o limite não incremente, é porque não houve tentativa de colorir, logo, sem espaço
    if(limit === 0){
        window.alert(`ERRO DE MEMÓRIA\nNÃO FOI POSSÍVEL ALOCAR ${inputValue} DE MEMÓRIA!`);
    }

    //Renderiza novamente o estado atual
    render();
}

//Acrescenta a função de busca ao botão
document.querySelector('button').onclick = search;
