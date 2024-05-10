**checar links do repositorio**
- git remote -v

**trocar o nome de origin para o**
- git remote rename origin o

**iniciar projeto node**
- install
  - npm init -y

**Biblioteca lint-stage e Husky**
permite rodar scripts na staged area
evita commits com falhas de formatação no codigo
tutorial para config abaixo:
https://valchan.com.br/lint-staged-husky/

**Biblioteca para testes JEST**
- install jest 
  - npm install --save-dev jest
- config jest
  - npm init jest@latest
  - add in package.json 
    - "scripts": {"test": "jest"}

- test options
  - watchAll - roda testes a cada alteração feita.
  - --passWithNoTests - se o jest não encontrar testes ele retorna sucesso.
  - watch -o - roda testes apenas da parte alterada no codigo.
  - --findRelatedTests - parecido com o watch, só roda os testes alterados.
  - --silent - não mostra o check list de testes nem os consoles, apenas o retorno do teste que não passou.
  - --verbose - mostra o check list dos testes mas não mostra os consoles.
  - --colors - usa cores pra destacar os testes no console.
  - --noStackTrace - mostra apenas os testes que não passaram.
  - --coverage - mostra relatorio dos testes com porcentagem de cobertura

**Framework backend  para Node, express**
- install
  - npm install express

**ORM para MongoDB, mongoose**
- install
  - npm install mongoose --save


**Clean Architecture**
- Principios
  - Isolar as camadas de caso de uso, consulta a banco de dados, rotas e dependencias.  