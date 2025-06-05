uniform mat4 textureMatrix;
varying vec4 mirrorCoord;
varying vec2 vUv;
                    
void main() {
    mirrorCoord = textureMatrix * vec4(position, 1.0);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}