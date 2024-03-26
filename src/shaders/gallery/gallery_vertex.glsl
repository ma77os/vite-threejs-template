#include ../includes/simplexNoise4d.glsl

uniform float time;
attribute vec4 tangent;


float getDistortion(vec3 position)
{
    float freq = 0.5;
    float timeFreq = 0.4;
    float strength = 0.8;
    return simplexNoise4d(vec4(position * freq, time * timeFreq)) * strength;
    // return vec3(
    //     sin(position.y * 0.5 + time*2.) * 0.5,
    //     0.0,
    //     cos(position.x * 1.1 * sin(time*0.4)*1.5) * 0.3
    // );
}

void main()
{
    vec3 biTangent = cross(normal, tangent.xyz);

    // Neighbours positions
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent * shift;

    float distortion = getDistortion(csm_Position);
    csm_Position += distortion * normal;

    positionA += getDistortion(positionA) * normal;
    positionB += getDistortion(positionB) * normal;

    // compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);
}