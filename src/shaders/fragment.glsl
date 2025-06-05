uniform vec3 color;
uniform sampler2D tDiffuse;
uniform sampler2D colorTexture;
uniform sampler2D heightTexture;
uniform float blurAmount;
uniform float blurRadius;
uniform float height;
uniform float reflectionStrength;
uniform vec2 textureRepeat;
varying vec4 mirrorCoord;
varying vec2 vUv;
                    
void main() {
    vec4 coord = mirrorCoord / mirrorCoord.w;
    vec4 reflection = texture2DProj(tDiffuse, coord);
    
    // Sample textures
    vec2 repeatedUV = vUv * textureRepeat;
    vec4 colorTex = texture2D(colorTexture, repeatedUV);
    vec4 heightTex = texture2D(heightTexture, repeatedUV);
    
    // Apply Gaussian blur
    vec4 blurred = vec4(0.0);
    float total = 0.1;
                        
    // 5x5 Gaussian kernel
    for(int x = -2; x <= 2; x++) {
        for(int y = -2; y <= 2; y++) {
            float weight = exp(-float(x*x + y*y) / (2.0 * blurAmount * blurAmount));
            vec2 offset = vec2(x, y) * blurRadius;
            blurred += texture2DProj(tDiffuse, vec4(coord.xy + offset, coord.zw)) * weight;
            total += weight;
        }
    }
    
    blurred /= total;
                        
                        // Mix reflection with textures
    vec3 finalColor = mix(blurred.rgb, colorTex.rgb, clamp(1.0 - reflectionStrength, 0.0, 1.0));
    // finalColor = mix(finalColor, color, 0.8);
                        
                        
                        
    gl_FragColor = vec4(finalColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}