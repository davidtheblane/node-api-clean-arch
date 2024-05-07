**checar links do repositorio**
- git remote -v

**trocar o nome de origin para o**
- git remote rename origin o

**iniciar projeto node**
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
