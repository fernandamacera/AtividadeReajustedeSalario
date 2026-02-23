import express from 'express';

const app = express();
const porta = 3000;

app.get('/', (req, res) => {
    let { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

    if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
        return res.send(`
            <h2>Instruções de Uso</h2>
            <p>Por favor, informe na url os seguintes dados:</p>
            <p>Exemplo: <code>http://localhost:3000/?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345</code></p>
        `);
    }

    const vIdade = parseInt(idade);
    const vSalario = parseFloat(salario_base);
    const vAno = parseInt(anoContratacao);
    const vMatricula = parseInt(matricula);
    const vSexo = sexo.toUpperCase();

    if (vIdade <= 16) return res.send("<h3>Erro: A idade deve ser maior que 16 anos;</h3>");
    if (isNaN(vSalario)) return res.send("<h3>Erro: O salário base deve ser um número real válido;</h3>");
    if (vAno <= 1960) return res.send("<h3>Erro: O ano de contratação deve ser maior que 1960;</h3>");
    if (vMatricula <= 0) return res.send("<h3>Erro: A matrícula deve ser um inteiro válido maior que zero;</h3>");

    
    const anoAtual = new Date().getFullYear();
    const tempoEmpresa = anoAtual - vAno;
    
    let reajuste = 0;
    let valorFixo = 0; 

    if (vIdade >= 18 && vIdade <= 39) {
        if (vSexo === 'M') {
            reajuste = 0.10;
            valorFixo = (tempoEmpresa <= 10) ? -10.00 : 17.00;
        } else {
            reajuste = 0.08;
            valorFixo = (tempoEmpresa <= 10) ? -11.00 : 16.00;
        }
    } 
    else if (vIdade >= 40 && vIdade <= 69) {
        if (vSexo === 'M') {
            reajuste = 0.08;
            valorFixo = (tempoEmpresa <= 10) ? -5.00 : 15.00;
        } else {
            reajuste = 0.10;
            valorFixo = (tempoEmpresa <= 10) ? -7.00 : 14.00;
        }
    }
    else if (vIdade >= 70 && vIdade <= 99) {
        if (vSexo === 'M') {
            reajuste = 0.15;
            valorFixo = (tempoEmpresa <= 10) ? -15.00 : 13.00;
        } else {
            reajuste = 0.17;
            valorFixo = (tempoEmpresa <= 10) ? -17.00 : 12.00;
        }
    } else {
        return res.send("<h3>Erro: Idade fora das faixas de reajuste.</h3>");
    }

    
    const novoSalario = (vSalario + (vSalario * reajuste)) + valorFixo;

    
    res.send(`
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px">
            <h2>Dados do Funcionário</h2>
            <ul>
                <li><strong>Matrícula:</strong> ${vMatricula}</li>
                <li><strong>Sexo:</strong> ${vSexo}</li>
                <li><strong>Idade:</strong> ${vIdade} anos</li>
                <li><strong>Ano de Contratação:</strong> ${vAno} (${tempoEmpresa} anos de empresa)</li>
                <li><strong>Salário Base:</strong> R$ ${vSalario.toFixed(2)}</li>
            </ul>
            <hr>
            <h2 style="color: #680b79; background: #e6adf6; padding: 15px; border-radius: 5px;">
                Salário Reajustado: R$ ${novoSalario.toFixed(2)}
            </h2>
        </div>
    `);
});

app.listen(porta, () => {
    console.log(`Servidor rodando perfeitamente na porta ${porta}!`);
});