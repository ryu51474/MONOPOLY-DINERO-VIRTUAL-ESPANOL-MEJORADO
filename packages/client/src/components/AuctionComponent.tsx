import { IGameStatePlayer, PlayerId } from "@monopoly-money/game-state";
import React, { useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { propertyGroups } from "../propertyData";
import { formatCurrency, getPlayerEmoji } from "../utils";
import { useSounds } from "./SoundProvider";

interface IAuctionComponentProps {
  players: IGameStatePlayer[];
  playerId: PlayerId;
  isBanker: boolean;
  activeAuction: {
    propertyColor: string;
    propertyPrice: number;
    highestBid: number;
    highestBidderId: PlayerId | null;
  } | null;
  proposeAuctionStart: (name: string, price: number) => void;
  proposeAuctionBid: (bidderId: string, amount: number) => void;
  proposeAuctionEnd: (cancelled: boolean) => void;
}

const AuctionComponent: React.FC<IAuctionComponentProps> = ({
  players,
  playerId,
  isBanker,
  activeAuction,
  proposeAuctionStart,
  proposeAuctionBid,
  proposeAuctionEnd
}) => {
  const [selectedPropId, setSelectedPropId] = useState<string>("");
  const [useNominalPrice, setUseNominalPrice] = useState(false);
  const [manualBid, setManualBid] = useState<string>("");
  const { playSound } = useSounds();

  const selectedProp = propertyGroups.find(p => p.name === selectedPropId);
  const me = players.find((p) => p.playerId === playerId);

  const startAuction = () => {
    if (selectedProp) {
      const startPrice = useNominalPrice ? selectedProp.price : 10;
      proposeAuctionStart(selectedProp.name, startPrice);
      playSound('click');
    }
  };

  const bid = (increment: number) => {
    if (activeAuction) {
      const newBid = activeAuction.highestBid + increment;
      if (me && me.balance >= newBid) {
        proposeAuctionBid(playerId, newBid);
        playSound('click');
      }
    }
  };

  const handleManualBid = () => {
    const value = parseInt(manualBid, 10);
    if (!isNaN(value) && activeAuction && value > activeAuction.highestBid) {
      if (me && me.balance >= value) {
        proposeAuctionBid(playerId, value);
        setManualBid("");
        playSound('click');
      }
    }
  };

  const getDisplayColors = () => {
    const propName = activeAuction ? activeAuction.propertyColor : selectedProp?.name;
    const prop = propertyGroups.find(p => p.name === propName);
    
    // Gris neutro discreto al inicio
    if (!prop) return { bg: "#ededed", text: "#666" };
    
    if (prop.color === "stations") return { bg: "#000000", text: "#fff" };
    if (prop.color === "utilities") return { bg: "#e6ffcc", text: "#000" };
    
    return { bg: prop.hex, text: ["light-blue", "yellow", "utilities", "white"].includes(prop.color) ? "#000" : "#fff" };
  };

  const colors = getDisplayColors();

  const getBillColor = (val: number) => {
    switch(val) {
      case 1: return { bg: '#ffffff', text: '#333' }; 
      case 5: return { bg: '#f48fb1', text: '#fff' }; 
      case 10: return { bg: '#81d4fa', text: '#333' }; 
      case 20: return { bg: '#a5d6a7', text: '#333' }; 
      case 50: return { bg: '#ce93d8', text: '#fff' }; 
      case 100: return { bg: '#fff59d', text: '#333' }; 
      default: return { bg: '#f8f9fa', text: '#333' };
    }
  };

  if (!activeAuction) {
    return (
      <Card className="mb-3 border-dark shadow-sm mt-4">
        <Card.Header 
          className="text-center font-weight-bold"
          style={{ backgroundColor: colors.bg, color: colors.text, transition: 'all 0.3s ease' }}
        >
          🔨 LLAMAR A SUBASTA
        </Card.Header>
        <Card.Body className="p-3">
          <Form.Group className="mb-2">
            <Form.Control
              as="select"
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
              size="lg"
              className="text-center font-weight-bold"
              style={{ height: 'auto', padding: '10px' }}
            >
              <option value="">-- Seleccione Propiedad --</option>
              {propertyGroups.map((p, idx) => (
                <option key={`${p.name}-${idx}`} value={p.name}>
                  {p.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          
          <Form.Check 
            type="switch"
            id="use-nominal-price"
            label="¿Iniciar con valor nominal?"
            checked={useNominalPrice}
            onChange={(e) => setUseNominalPrice(e.target.checked)}
            className="mb-3 small text-muted text-center"
          />

          <Button 
            variant="dark" 
            size="lg"
            className="w-100 font-weight-bold shadow-sm"
            onClick={startAuction}
            disabled={!selectedPropId}
            style={{ 
              backgroundColor: colors.bg, 
              color: colors.text, 
              borderColor: 'rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease' 
            }}
          >
            Iniciar Subasta
          </Button>
        </Card.Body>
      </Card>
    );
  }

  const highestBidder = players.find((p) => p.playerId === activeAuction.highestBidderId);
  const isMeWinner = activeAuction.highestBidderId === playerId;
  const projectionIfWin = me ? me.balance - activeAuction.highestBid : 0;
  // If I'm not the winner, I'd need to bid at least current + 1 to stay in or just show the projection of matching (user said "si tu pujaras lo mismo")
  const canIBidAtLeastOne = me ? me.balance > activeAuction.highestBid : false;

  return (
    <Card className="mb-3 shadow-lg mt-2 border-0 overflow-hidden auction-active-card">
      <Card.Header 
        className="text-center font-weight-bold py-3"
        style={{ backgroundColor: colors.bg, color: colors.text, border: 'none' }}
      >
        🔥 SUBASTA EN CURSO 🔥
      </Card.Header>
      <Card.Body className="text-center p-3">
        <h3 className="mb-1 font-weight-bold" style={{ fontSize: '1.4rem' }}>{activeAuction.propertyColor}</h3>
        <div className="display-4 font-weight-bold mb-2 text-success" style={{ letterSpacing: '-1px' }}>
          {formatCurrency(activeAuction.highestBid)}
        </div>
        
        {highestBidder ? (
          <div className="mb-3 p-2 bg-light rounded-pill border shadow-sm">
            <span className="player-emoji mr-2" role="img" aria-label="animal">
              {getPlayerEmoji(highestBidder.playerId)}
            </span>
            <strong className="small">{highestBidder.name}</strong> <span className="small text-muted">va ganando</span>
          </div>
        ) : (
          <div className="mb-3 text-muted small">Precio inicial: {formatCurrency(activeAuction.propertyPrice)}</div>
        )}

        {me && (
          <div className="mb-3 small p-2 rounded bg-light border" style={{ fontSize: '0.82rem' }}>
            <div className="d-flex justify-content-between px-1 mb-1">
              <span>Saldo actual:</span>
              <span className="font-weight-bold">{formatCurrency(me.balance)}</span>
            </div>
            
            {isMeWinner ? (
               <div className="d-flex justify-content-between px-1 text-success border-top pt-1">
                <span>Si ganas, te quedarán:</span>
                <span className="font-weight-bold">{formatCurrency(projectionIfWin)}</span>
               </div>
            ) : (
              <>
                {canIBidAtLeastOne ? (
                  <div className="d-flex justify-content-between px-1 text-info border-top pt-1">
                    <span>Si tu pujaras lo mismo quedas:</span>
                    <span className="font-weight-bold">{formatCurrency(projectionIfWin)}</span>
                  </div>
                ) : (
                  <div className="text-danger border-top pt-1 font-weight-bold text-center">
                    ⚠️ No puedes pujar: Fondos insuficientes
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="mb-3">
          <label className="d-block x-small text-muted mb-2 font-italic" style={{ fontSize: '0.75rem' }}>Pujar adicionales:</label>
          <div className="d-flex flex-wrap justify-content-center">
            {[1, 5, 10, 20, 50, 100].map((amount) => {
              const billStyles = getBillColor(amount);
              return (
                <Button
                  key={amount}
                  variant="light"
                  size="sm"
                  className="m-1 font-weight-bold border-dark shadow-sm"
                  onClick={() => bid(amount)}
                  disabled={me && me.balance < activeAuction.highestBid + amount}
                  style={{ 
                    borderRadius: '4px', 
                    minWidth: '55px', 
                    backgroundColor: billStyles.bg, 
                    color: billStyles.text,
                    border: '1.5px solid #444'
                  }}
                >
                  +{amount}
                </Button>
              );
            })}
          </div>
        </div>

        <InputGroup size="sm" className="mb-3 px-1">
          <Form.Control
            placeholder="Otra puja..."
            type="number"
            value={manualBid}
            onChange={(e) => setManualBid(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleManualBid()}
            style={{ borderRadius: '4px 0 0 4px' }}
          />
          <InputGroup.Append>
            <Button variant="outline-dark" onClick={handleManualBid} style={{ borderRadius: '0 4px 4px 0' }}>Pujar</Button>
          </InputGroup.Append>
        </InputGroup>

        {isBanker && (
          <div className="mt-4 pt-3 border-top d-flex justify-content-between gap-2 px-1">
            <Button variant="danger" size="sm" className="flex-fill" onClick={() => proposeAuctionEnd(true)}>
              Anular
            </Button>
            <Button 
              variant="success" 
              size="sm" 
              className="flex-fill ml-2 font-weight-bold"
              onClick={() => proposeAuctionEnd(false)}
              disabled={!activeAuction.highestBidderId}
            >
              ¡Vendido!
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AuctionComponent;
