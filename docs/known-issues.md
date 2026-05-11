# Falhas identificadas e melhorias

Limitações conhecidas, dívidas técnicas e melhorias que seriam implementadas com mais tempo em outras versões.

---


| Problema    | Possível melhoria           | 
|---------|---------------------|
| Cada novo login sobrescreve o token, deslogando sessões abertas em outros dispositivos.   | Seguindo a implementação simples, uma tabela intermediária `sessions` resolveria.    | 
| GET /courses sem paginação  |  Usar gem `pagy` para paginação | 
| a busca de aulas dentro de um curso é feita localmente no frontend após carregar todas as aulas. | parâmetro `?search=` no endpoint de lessons, similar ao que existe em courses. | 
| Testes automatizados  |  Não há cobertura de testes | 
| CI / CD |  Action com cobertura de teste (simplecov) e formatação de código (rubocop) | 
| Quando commitado na main, o front e o backend são buildados independente de onde foi feita a alteração  |  Ajustar diretório "observado" na railway e vercel | 
| Pouca utilização de branches para novas features  |  Utilizar padrão de versionamento nas branches além dos commits semânticos |
| Na tela de login e register não há como voltar à home a não ser pela navegação do próprio browser  |  Implementar botão ou ícone clicável que retorne à home. | 
