import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import copBg from "./assets/cop.webp";

const mapaFlags = {
  Alemanha: "alemanha",
  Paraguai: "paraguai",
  França: "franca",
  Suécia: "suecia",
  "África do Sul": "africa_sul",
  Canadá: "canada",
  Holanda: "holanda",
  Marrocos: "marrocos",
  Portugal: "portugal",
  Croácia: "croacia",
  Espanha: "espanha",
  Áustria: "austria",
  "Estados Unidos": "usa",
  "Bósnia-Herzeg.": "bosnia",
  Bélgica: "belgica",
  Senegal: "senegal",
  Brasil: "brasil",
  Japão: "japao",
  "Costa do Marfim": "costa_marfim",
  Noruega: "noruega",
  México: "mexico",
  Equador: "equador",
  Inglaterra: "inglaterra",
  "RD Congo": "rd_congo",
  Argentina: "argentina",
  "Cabo Verde": "cabo_verde",
  Austrália: "australia",
  Egito: "egito",
  Suíça: "suica",
  Argélia: "argelia",
  Colômbia: "colombia",
  Gana: "gana",
};

const RenderTeam = ({ team, isSelected, onClick }) => (
  <div
    className={`team ${isSelected ? "selected" : ""} team-${mapaFlags[team]}`}
    onClick={onClick}
  >
    <img src={`${import.meta.env.BASE_URL}${mapaFlags[team]}.png`} alt={team} />
    {team}
  </div>
);

const ladoEsquerdo = [
  ["Alemanha", "Paraguai"],
  ["França", "Suécia"],
  ["África do Sul", "Canadá"],
  ["Holanda", "Marrocos"],
  ["Portugal", "Croácia"],
  ["Espanha", "Áustria"],
  ["Estados Unidos", "Bósnia-Herzeg."],
  ["Bélgica", "Senegal"],
];
const ladoDireito = [
  ["Brasil", "Japão"],
  ["Costa do Marfim", "Noruega"],
  ["México", "Equador"],
  ["Inglaterra", "RD Congo"],
  ["Argentina", "Cabo Verde"],
  ["Austrália", "Egito"],
  ["Suíça", "Argélia"],
  ["Colômbia", "Gana"],
];

function App() {
  const [vencedores, setVencedores] = useState({});
  const bracketRef = useRef(null);

  useEffect(() => {
    const ajustar = () => {
      const el = bracketRef.current;
      if (!el) return;

     
      if (window.innerWidth < 768) {
        el.style.transform = "none";
        el.style.marginBottom = "0px";
        return;
      }

      const margem = 80;
      const larguraTela = window.innerWidth - margem;
      const larguraReal = el.scrollWidth;
      const escala = larguraTela < larguraReal ? larguraTela / larguraReal : 1;

      el.style.transform = `scale(${escala})`;
      el.style.transformOrigin = "top center";
      el.style.marginBottom = `${(escala - 1) * el.scrollHeight}px`;
    };

    ajustar();
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, []);

  const handleSelect = (index, fase, lado, time) =>
    setVencedores((prev) => ({ ...prev, [`${lado}-${fase}-${index}`]: time }));

  const renderFase = (faseAtual, faseAnterior, numJogos, lado) => {
    return [...Array(numJogos)].map((_, i) => {
      const v1 = vencedores[`${lado}-${faseAnterior}-${i * 2}`];
      const v2 = vencedores[`${lado}-${faseAnterior}-${i * 2 + 1}`];
      return (
        <div key={`${lado}-${faseAtual}-${i}`} className="confronto-wrapper">
          <div className="confronto-box">
            {v1 && v2 ? (
              <div className="match">
                <RenderTeam
                  team={v1}
                  isSelected={vencedores[`${lado}-${faseAtual}-${i}`] === v1}
                  onClick={() => handleSelect(i, faseAtual, lado, v1)}
                />
                <RenderTeam
                  team={v2}
                  isSelected={vencedores[`${lado}-${faseAtual}-${i}`] === v2}
                  onClick={() => handleSelect(i, faseAtual, lado, v2)}
                />
              </div>
            ) : (
              <div className="placeholder">Aguardando...</div>
            )}
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    const salvo = localStorage.getItem("chaveamentoCopa");
    if (salvo) setVencedores(JSON.parse(salvo));
  }, []);

  useEffect(() => {
    localStorage.setItem("chaveamentoCopa", JSON.stringify(vencedores));
  }, [vencedores]);

  const reiniciar = () => {
    setVencedores({});
    localStorage.removeItem("chaveamentoCopa");
  };

  const preencherAleatorio = () => {
    let novosVencedores = {};
    const escolher = (t1, t2) => (Math.random() > 0.5 ? t1 : t2);

    ladoEsquerdo.forEach(
      (match, i) =>
        (novosVencedores[`left-16avos-${i}`] = escolher(match[0], match[1])),
    );
    ladoDireito.forEach(
      (match, i) =>
        (novosVencedores[`right-16avos-${i}`] = escolher(match[0], match[1])),
    );

    for (let i = 0; i < 4; i++) {
      novosVencedores[`left-oitavas-${i}`] = escolher(
        novosVencedores[`left-16avos-${i * 2}`],
        novosVencedores[`left-16avos-${i * 2 + 1}`],
      );
      novosVencedores[`right-oitavas-${i}`] = escolher(
        novosVencedores[`right-16avos-${i * 2}`],
        novosVencedores[`right-16avos-${i * 2 + 1}`],
      );
    }

    for (let i = 0; i < 2; i++) {
      novosVencedores[`left-quartas-${i}`] = escolher(
        novosVencedores[`left-oitavas-${i * 2}`],
        novosVencedores[`left-oitavas-${i * 2 + 1}`],
      );
      novosVencedores[`right-quartas-${i}`] = escolher(
        novosVencedores[`right-oitavas-${i * 2}`],
        novosVencedores[`right-oitavas-${i * 2 + 1}`],
      );
    }

    novosVencedores[`left-semi-0`] = escolher(
      novosVencedores[`left-quartas-0`],
      novosVencedores[`left-quartas-1`],
    );
    novosVencedores[`right-semi-0`] = escolher(
      novosVencedores[`right-quartas-0`],
      novosVencedores[`right-quartas-1`],
    );

    novosVencedores[`final-0`] = escolher(
      novosVencedores[`left-semi-0`],
      novosVencedores[`right-semi-0`],
    );

    setVencedores(novosVencedores);
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${copBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-overlay" />

      <h1>Copa 2026</h1>

      <div
        className="menu-botoes"
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          zIndex: 1,
          position: "relative",
        }}
      >
        <button onClick={preencherAleatorio} className="btn-action">
          Preencher Aleatório
        </button>
        <button onClick={reiniciar} className="btn-action">
          Reiniciar
        </button>
      </div>

      <div className="bracket-container" ref={bracketRef}>
        <div className="column">
          {ladoEsquerdo.map((match, i) => (
            <div key={i} className="match">
              {match.map((team) => (
                <RenderTeam
                  key={team}
                  team={team}
                  isSelected={vencedores[`left-16avos-${i}`] === team}
                  onClick={() => handleSelect(i, "16avos", "left", team)}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="column">
          {renderFase("oitavas", "16avos", 4, "left")}
        </div>
        <div className="column">
          {renderFase("quartas", "oitavas", 2, "left")}
        </div>
        <div className="column">{renderFase("semi", "quartas", 1, "left")}</div>

        <div className="column final-column">
          {vencedores["final-0"] && (
            <div className="match champion-box">
              <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem" }}>
                🏆 CAMPEÃO DA COPA 2026 🏆
              </h4>
              <RenderTeam team={vencedores["final-0"]} isSelected={true} />
            </div>
          )}
          <div className="match" style={{ alignItems: "center" }}>
            <h3
              style={{
                margin: "0 0 6px 0",
                textAlign: "center",
                fontSize: "1rem",
              }}
            >
              FINAL
            </h3>
            {vencedores["left-semi-0"] && vencedores["right-semi-0"] ? (
              <>
                <RenderTeam
                  team={vencedores["left-semi-0"]}
                  isSelected={
                    vencedores["final-0"] === vencedores["left-semi-0"]
                  }
                  onClick={() =>
                    setVencedores((p) => ({
                      ...p,
                      "final-0": vencedores["left-semi-0"],
                    }))
                  }
                />
                <RenderTeam
                  team={vencedores["right-semi-0"]}
                  isSelected={
                    vencedores["final-0"] === vencedores["right-semi-0"]
                  }
                  onClick={() =>
                    setVencedores((p) => ({
                      ...p,
                      "final-0": vencedores["right-semi-0"],
                    }))
                  }
                />
              </>
            ) : (
              <div className="placeholder">Aguardando...</div>
            )}
          </div>
        </div>

        <div className="column">
          {renderFase("semi", "quartas", 1, "right")}
        </div>
        <div className="column">
          {renderFase("quartas", "oitavas", 2, "right")}
        </div>
        <div className="column">
          {renderFase("oitavas", "16avos", 4, "right")}
        </div>

        <div className="column">
          {ladoDireito.map((match, i) => (
            <div key={i} className="match">
              {match.map((team) => (
                <RenderTeam
                  key={team}
                  team={team}
                  isSelected={vencedores[`right-16avos-${i}`] === team}
                  onClick={() => handleSelect(i, "16avos", "right", team)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
