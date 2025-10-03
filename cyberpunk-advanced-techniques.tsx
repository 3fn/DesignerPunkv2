import React, { useState } from 'react';

export default function AdvancedTechniquesDemo() {
  const [mode, setMode] = useState('dark');
  
  const bgColor = mode === 'dark' ? '#0A0A0F' : '#FFFFFF';
  const textColor = mode === 'dark' ? '#E8E8F0' : '#0A0A0F';
  const cardBg = mode === 'dark' ? '#1A1826' : '#F2F2FA';

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh' }} className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 style={{ color: textColor }} className="text-4xl font-bold mb-2">
              Advanced Techniques
            </h1>
            <p style={{ color: mode === 'dark' ? '#9999AB' : '#68658A' }} className="text-lg">
              Visual examples of cyberpunk design patterns
            </p>
          </div>
          <button
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            style={{
              backgroundColor: mode === 'dark' ? '#5B2C91' : '#F9F002',
              color: mode === 'dark' ? '#FFFFFF' : '#000000'
            }}
            className="px-6 py-3 rounded-lg font-bold"
          >
            {mode === 'dark' ? 'Dark' : 'Light'} Mode
          </button>
        </div>

        <div className="space-y-12">
          {/* Glass Morphism */}
          <section>
            <h2 style={{ color: textColor }} className="text-2xl font-bold mb-4">
              1. Glass Morphism
            </h2>
            <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#52525C' }} className="mb-6">
              Create modern glass effects with transparency, blur, and subtle borders
            </p>
            
            <div 
              style={{ 
                background: mode === 'dark' 
                  ? 'linear-gradient(135deg, #B026FF 0%, #00F0FF 100%)'
                  : 'linear-gradient(135deg, #A928E6 0%, #00C5D9 100%)',
                padding: '60px',
                borderRadius: '16px',
                position: 'relative'
              }}
            >
              {/* Glass Card 1 */}
              <div
                style={{
                  background: mode === 'dark' 
                    ? 'rgba(45, 43, 62, 0.4)'
                    : 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: mode === 'dark'
                    ? '1px solid rgba(232, 232, 240, 0.2)'
                    : '1px solid rgba(10, 10, 15, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: mode === 'dark'
                    ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                    : '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
                  marginBottom: '20px',
                  maxWidth: '400px'
                }}
              >
                <h3 style={{ color: textColor }} className="text-xl font-bold mb-2">
                  Glass Card Example
                </h3>
                <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#2E2E38' }} className="text-sm mb-4">
                  Notice the frosted glass effect with subtle transparency. The background bleeds through beautifully.
                </p>
                <button
                  style={{
                    background: mode === 'dark'
                      ? 'rgba(176, 38, 255, 0.8)'
                      : 'rgba(122, 29, 166, 0.9)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }}
                >
                  Action Button
                </button>
              </div>

              {/* Glass Card 2 - More Transparent */}
              <div
                style={{
                  background: mode === 'dark' 
                    ? 'rgba(45, 43, 62, 0.25)'
                    : 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: mode === 'dark'
                    ? '1px solid rgba(232, 232, 240, 0.15)'
                    : '1px solid rgba(10, 10, 15, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: mode === 'dark'
                    ? '0 4px 16px 0 rgba(0, 0, 0, 0.25)'
                    : '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
                  maxWidth: '300px',
                  marginLeft: 'auto'
                }}
              >
                <p style={{ color: textColor, fontSize: '14px' }}>
                  <strong>Lighter variation</strong> - Less blur, more transparency
                </p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: cardBg,
              color: mode === 'dark' ? '#9999AB' : '#52525C',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}>
              background: rgba(45, 43, 62, 0.4);<br/>
              backdrop-filter: blur(20px);<br/>
              border: 1px solid rgba(232, 232, 240, 0.2);
            </div>
          </section>

          {/* Neon Glow Effects */}
          <section>
            <h2 style={{ color: textColor }} className="text-2xl font-bold mb-4">
              2. Neon Glow Effects
            </h2>
            <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#52525C' }} className="mb-6">
              Simulate glowing neon signs with layered shadows
            </p>
            
            <div 
              style={{ 
                backgroundColor: mode === 'dark' ? '#0A0A0F' : '#1A1826',
                padding: '60px',
                borderRadius: '16px',
                textAlign: 'center'
              }}
            >
              {/* Purple Glow */}
              <h3
                style={{
                  color: '#B026FF',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  textShadow: `
                    0 0 10px rgba(176, 38, 255, 0.8),
                    0 0 20px rgba(176, 38, 255, 0.6),
                    0 0 30px rgba(176, 38, 255, 0.4),
                    0 0 40px rgba(176, 38, 255, 0.2)
                  `,
                  marginBottom: '30px',
                  letterSpacing: '2px'
                }}
              >
                NEON PURPLE
              </h3>

              {/* Cyan Glow */}
              <h3
                style={{
                  color: '#00F0FF',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  textShadow: `
                    0 0 10px rgba(0, 240, 255, 0.8),
                    0 0 20px rgba(0, 240, 255, 0.6),
                    0 0 30px rgba(0, 240, 255, 0.4),
                    0 0 40px rgba(0, 192, 204, 0.2)
                  `,
                  marginBottom: '30px',
                  letterSpacing: '2px'
                }}
              >
                CYBER CYAN
              </h3>

              {/* Yellow Glow */}
              <h3
                style={{
                  color: '#F9F002',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  textShadow: `
                    0 0 10px rgba(249, 240, 2, 0.8),
                    0 0 20px rgba(249, 240, 2, 0.6),
                    0 0 30px rgba(249, 240, 2, 0.4),
                    0 0 40px rgba(199, 192, 2, 0.2)
                  `,
                  letterSpacing: '2px'
                }}
              >
                HOT YELLOW
              </h3>
            </div>

            <div style={{ 
              backgroundColor: cardBg,
              color: mode === 'dark' ? '#9999AB' : '#52525C',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}>
              color: #B026FF;<br/>
              text-shadow:<br/>
              &nbsp;&nbsp;0 0 10px rgba(176, 38, 255, 0.8),<br/>
              &nbsp;&nbsp;0 0 20px rgba(176, 38, 255, 0.6),<br/>
              &nbsp;&nbsp;0 0 30px rgba(176, 38, 255, 0.4);
            </div>
          </section>

          {/* Gradient Overlays */}
          <section>
            <h2 style={{ color: textColor }} className="text-2xl font-bold mb-4">
              3. Gradient Overlays
            </h2>
            <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#52525C' }} className="mb-6">
              Create depth and atmosphere with layered gradients
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gradient 1: Vertical Fade */}
              <div
                style={{
                  background: mode === 'dark'
                    ? 'linear-gradient(180deg, #0A0A0F 0%, rgba(91, 44, 145, 0.3) 50%, #06060A 100%)'
                    : 'linear-gradient(180deg, #FFFFFF 0%, rgba(169, 40, 230, 0.15) 50%, #F2F2FA 100%)',
                  borderRadius: '16px',
                  padding: '40px',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <h4 style={{ color: textColor }} className="text-xl font-bold mb-2">
                  Vertical Atmosphere
                </h4>
                <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#52525C' }} className="text-center text-sm">
                  Purple haze in the middle creates depth without overwhelming the content
                </p>
              </div>

              {/* Gradient 2: Radial Spotlight */}
              <div
                style={{
                  background: mode === 'dark'
                    ? 'radial-gradient(circle at center, rgba(0, 240, 255, 0.15) 0%, #0A0A0F 70%)'
                    : 'radial-gradient(circle at center, rgba(0, 197, 217, 0.2) 0%, #FFFFFF 70%)',
                  borderRadius: '16px',
                  padding: '40px',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <h4 style={{ color: textColor }} className="text-xl font-bold mb-2">
                  Radial Spotlight
                </h4>
                <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#52525C' }} className="text-center text-sm">
                  Cyan glow draws attention to the center, like a holographic projection
                </p>
              </div>

              {/* Gradient 3: Diagonal Energy */}
              <div
                style={{
                  background: mode === 'dark'
                    ? 'linear-gradient(135deg, #0A0A0F 0%, rgba(176, 38, 255, 0.2) 50%, rgba(0, 240, 255, 0.2) 100%)'
                    : 'linear-gradient(135deg, #FFFFFF 0%, rgba(169, 40, 230, 0.15) 50%, rgba(0, 197, 217, 0.15) 100%)',
                  borderRadius: '16px',
                  padding: '40px',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <h4 style={{ color: textColor }} className="text-xl font-bold mb-2">
                  Diagonal Energy
                </h4>
                <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#52525C' }} className="text-center text-sm">
                  Purple to cyan transition creates dynamic movement
                </p>
              </div>

              {/* Gradient 4: Edge Vignette */}
              <div
                style={{
                  background: mode === 'dark'
                    ? 'radial-gradient(ellipse at center, #2D2B3E 0%, #0A0A0F 100%)'
                    : 'radial-gradient(ellipse at center, #FFFFFF 0%, #E8E8F0 100%)',
                  borderRadius: '16px',
                  padding: '40px',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <h4 style={{ color: textColor }} className="text-xl font-bold mb-2">
                  Edge Vignette
                </h4>
                <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#52525C' }} className="text-center text-sm">
                  Subtle darkening at edges focuses attention inward
                </p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: cardBg,
              color: mode === 'dark' ? '#9999AB' : '#52525C',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}>
              background: linear-gradient(135deg,<br/>
              &nbsp;&nbsp;#0A0A0F 0%,<br/>
              &nbsp;&nbsp;rgba(176, 38, 255, 0.2) 50%,<br/>
              &nbsp;&nbsp;rgba(0, 240, 255, 0.2) 100%);
            </div>
          </section>

          {/* Progressive Disclosure */}
          <section>
            <h2 style={{ color: textColor }} className="text-2xl font-bold mb-4">
              4. Progressive Disclosure
            </h2>
            <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#52525C' }} className="mb-6">
              Reveal complexity gradually using opacity states
            </p>
            
            <div 
              style={{ 
                backgroundColor: mode === 'dark' ? '#1A1826' : '#F2F2FA',
                padding: '40px',
                borderRadius: '16px'
              }}
            >
              <div className="space-y-4">
                {/* Inactive State */}
                <div
                  style={{
                    backgroundColor: mode === 'dark' ? 'rgba(45, 43, 62, 0.4)' : 'rgba(232, 232, 240, 0.5)',
                    color: mode === 'dark' 
                      ? 'rgba(194, 192, 212, 0.4)' 
                      : 'rgba(46, 46, 56, 0.5)',
                    padding: '20px',
                    borderRadius: '8px',
                    border: mode === 'dark'
                      ? '1px solid rgba(104, 101, 138, 0.3)'
                      : '1px solid rgba(104, 101, 138, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <strong style={{ opacity: 0.6 }}>Inactive Item</strong> - 40% opacity (not available)
                </div>

                {/* Hover State */}
                <div
                  style={{
                    backgroundColor: mode === 'dark' ? 'rgba(45, 43, 62, 0.7)' : 'rgba(232, 232, 240, 0.8)',
                    color: mode === 'dark' 
                      ? 'rgba(194, 192, 212, 0.7)' 
                      : 'rgba(46, 46, 56, 0.8)',
                    padding: '20px',
                    borderRadius: '8px',
                    border: mode === 'dark'
                      ? '1px solid rgba(104, 101, 138, 0.6)'
                      : '1px solid rgba(104, 101, 138, 0.5)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <strong style={{ opacity: 0.8 }}>Hover State</strong> - 70% opacity (shows more detail)
                </div>

                {/* Active State */}
                <div
                  style={{
                    backgroundColor: mode === 'dark' ? '#2D2B3E' : '#E8E8F0',
                    color: mode === 'dark' ? '#C2C0D4' : '#2E2E38',
                    padding: '20px',
                    borderRadius: '8px',
                    border: mode === 'dark'
                      ? '2px solid #8A879E'
                      : '2px solid #68658A',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <strong>Active Item</strong> - 100% opacity (fully revealed)
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: cardBg,
              color: mode === 'dark' ? '#9999AB' : '#52525C',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}>
              /* Inactive */ opacity: 0.4;<br/>
              /* Hover */ opacity: 0.7;<br/>
              /* Active */ opacity: 1.0;<br/>
              transition: all 0.3s ease;
            </div>
          </section>

          {/* Layered Cards with Elevation */}
          <section>
            <h2 style={{ color: textColor }} className="text-2xl font-bold mb-4">
              5. Layered Cards with Elevation
            </h2>
            <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#52525C' }} className="mb-6">
              Create depth using color progression and shadows
            </p>
            
            <div 
              style={{ 
                backgroundColor: mode === 'dark' ? '#0A0A0F' : '#E8E8F0',
                padding: '60px',
                borderRadius: '16px',
                position: 'relative'
              }}
            >
              {/* Layer 1 - Base */}
              <div
                style={{
                  backgroundColor: mode === 'dark' ? '#15131F' : '#FFFFFF',
                  padding: '40px',
                  borderRadius: '12px',
                  boxShadow: mode === 'dark'
                    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <p style={{ color: mode === 'dark' ? '#9999AB' : '#68658A', marginBottom: '20px' }}>
                  Layer 1 - Base Surface
                </p>

                {/* Layer 2 - Elevated */}
                <div
                  style={{
                    backgroundColor: mode === 'dark' ? '#1F1D2E' : '#F5F5FA',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: mode === 'dark'
                      ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                      : '0 4px 16px rgba(0, 0, 0, 0.12)',
                    marginBottom: '20px'
                  }}
                >
                  <p style={{ color: mode === 'dark' ? '#B8B6C8' : '#52525C', marginBottom: '20px' }}>
                    Layer 2 - Elevated Card
                  </p>

                  {/* Layer 3 - Most Elevated */}
                  <div
                    style={{
                      backgroundColor: mode === 'dark' ? '#2D2B3E' : '#FFFFFF',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: mode === 'dark'
                        ? '0 8px 24px rgba(0, 0, 0, 0.5)'
                        : '0 8px 24px rgba(0, 0, 0, 0.15)',
                      border: mode === 'dark'
                        ? '1px solid #68658A'
                        : '1px solid #C2C0D4'
                    }}
                  >
                    <p style={{ color: textColor }}>
                      <strong>Layer 3 - Highest Elevation</strong>
                    </p>
                    <p style={{ color: mode === 'dark' ? '#C2C0D4' : '#52525C', fontSize: '14px', marginTop: '8px' }}>
                      Notice how each layer gets lighter (dark mode) or maintains contrast (light mode)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: cardBg,
              color: mode === 'dark' ? '#9999AB' : '#52525C',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}>
              /* Dark Mode Elevation */<br/>
              Layer 1: #15131F + shadow: 0 2px 8px<br/>
              Layer 2: #1F1D2E + shadow: 0 4px 16px<br/>
              Layer 3: #2D2B3E + shadow: 0 8px 24px
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}