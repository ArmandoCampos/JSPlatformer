package com.mustardplus.vertical.utils;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Preferences;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.Sprite;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.Vector2;

public class Tools {

    public static int translateCoord(int yy){
        return (Gdx.graphics.getHeight() - yy);
    }

    public static void log(String tag, String title, float xx, float yy){
        Gdx.app.log(tag, title+" ~ ["+xx+", "+yy+"]");
    }

    public static int sign(float value){
        if(value > 0)return 1;
        if(value < 0)return -1;
        return 0;
    }

    public static float dampen(float base, float value, float amount){
        if(value > base){
            float nxt = value - amount;
            if(nxt <= base)return base;
            return nxt;
        }else if (value < base){
            float nxt = value + amount;
            if(nxt >= base)return base;
            return nxt;
        }
        return base;
    }
    public static float dampen_part(float base, float value, float amount){
        if(value > base){
            float nxt = value - amount;
            if(nxt <= base)return 0;
            return -amount;
        }else if (value < base){
            float nxt = value + amount;
            if(nxt >= base)return 0;
            return amount;
        }
        return base;
    }

    public static float getDistance(Vector2 post, Vector2 post2){
        float disX = Math.abs(post.x - post2.x);
        float disY = Math.abs(post.y - post2.y);
        disX *= disX;
        disY *= disY;
        return (float) Math.sqrt(disX + disY);
    }
    public static float getDistance(float x1, float y1, float x2, float y2){
        return getDistance(new Vector2(x1, y1), new Vector2(x2, y2));
    }

    public static float getDirection(Vector2 post, Vector2 post2){
        double dy = post2.y - post.y;
        double dx = post2.x - post.x;
        return radToDeg(Math.atan2(dy, dx));
    }
    public static float getDirection(float x1, float y1, float x2, float y2){
        return getDirection(new Vector2(x1, y1), new Vector2(x2, y2));
    }

    public static float radToDeg(double rad){
        double deg = Math.toDegrees(rad);
        return (float) deg;
    }
    public static double degToRad(float deg){
        return Math.toRadians(deg);
    }

    public static float guiToView(int gg, int vv, float value){
        return (value / (float)gg)*((float) vv);
    }

    public static void setAlpha(SpriteBatch batch, float alpha){
        Color c = batch.getColor();
        batch.setColor(c.r, c.g, c.b, alpha);
    }
    public static void setAlpha(BitmapFont fnt, SpriteBatch batch){
        Color c = batch.getColor();
        fnt.setColor(c);
    }
    public static void setAlpha(BitmapFont fnt, float alpha){
        Color c = fnt.getColor();
        fnt.setColor(c.r, c.g, c.g, alpha);
    }

    public static void draw_rectangle(SpriteBatch batch, Texture txt, int x1, int y1, int x2, int y2){
        int left = Math.min(x1, x2), right = Math.max(x1, x2);
        int bottom = Math.min(y1, y2), top = Math.max(y1, y2);
        int width = (right - left), height = (top - bottom);
        draw_repeat(batch, txt, left, bottom, width, height, 0, 0);
    }
    public static void draw_rectangle_faded(SpriteBatch batch, Texture txt, int x1, int y1, int x2, int y2){
        int left = Math.min(x1, x2), right = Math.max(x1, x2);
        int bottom = Math.min(y1, y2), top = Math.max(y1, y2);
        int width = (right - left), height = (top - bottom);
        draw_repeat_faded(batch, txt, left, bottom, width, height, 0, 0, 1, 1);
    }
    public static void draw_rectangle_faded(SpriteBatch batch, Texture txt, int x1, int y1, int x2, int y2, int ww, int hh){
        int left = Math.min(x1, x2), right = Math.max(x1, x2);
        int bottom = Math.min(y1, y2), top = Math.max(y1, y2);
        int width = (right - left), height = (top - bottom);
        draw_repeat_faded(batch, txt, left, bottom, width, height, 0, 0, ww, hh);
    }

    public static void draw_repeat(SpriteBatch batch, Texture txt, float xx, float yy, float width, float height, int sepx, int sepy){
        int tw = txt.getWidth() + sepx, th = txt.getHeight() + sepy;
        int spacesx = (int) (width/tw), spacesy = (int) (height/th);
        for(int _y = 0; _y <= spacesy; _y++){
            for(int _x = 0; _x <= spacesx; _x++)batch.draw(txt, xx+(_x*tw), yy+(_y*th));
        }
    }
    public static void draw_repeat(SpriteBatch batch, Texture txt, float xx, float yy, float width, float height, int sepx, int sepy, int ww, int hh){
        int tw = ww + sepx, th = hh + sepy;
        int spacesx = (int) (width/tw), spacesy = (int) (height/th);
        for(int _y = 0; _y <= spacesy; _y++){
            for(int _x = 0; _x <= spacesx; _x++)batch.draw(txt, xx+(_x*tw), yy+(_y*th), ww, hh);
        }
    }
    public static void draw_repeat_faded(SpriteBatch batch, Texture txt, float xx, float yy, float width, float height, int sepx, int sepy, int ww, int hh){
        int tw = ww + sepx, th = hh + sepy;
        int spacesx = (int) (width/tw), spacesy = (int) (height/th);
        for(int _y = 0; _y <= spacesy; _y++){
            float amount = 1 - ((float) _y / (float) spacesy);
            setAlpha(batch, amount);
            for(int _x = 0; _x <= spacesx; _x++)batch.draw(txt, xx+(_x*tw), yy+(_y*th), ww, hh);
            setAlpha(batch, 1f);
        }
    }

    public static void draw_repeat_hor(SpriteBatch batch, Texture txt, float xx, float yy, float width, int sep){
        int tw = txt.getWidth() + sep;
        int spaces = (int) (width/tw)+1;
        for(int i = 0; i <= spaces; i++){
            batch.draw(txt, xx+(i*tw), yy);
        }
    }
    public static void draw_repeat_hor(SpriteBatch batch, Texture txt, float xx, float yy, float width, int sep, int ww, int hh, int ex){
        int tw = ww + sep;
        int spaces = (int) (width/tw)+ex;
        for(int i = 0; i <= spaces; i++){
            batch.draw(txt, xx+(i*tw), yy, ww, hh);
        }
    }
    public static void draw_repeat_vert(SpriteBatch batch, Texture txt, float xx, float yy, float height, int sep){
        int th = txt.getHeight() + sep;
        int spaces = (int) (height/th)+1;
        for(int i = 0; i <= spaces; i++){
            batch.draw(txt, xx, yy+(i*th));
        }
    }
    public static void draw_repeat_vert(SpriteBatch batch, Texture txt, float xx, float yy, float height, int sep, int ww, int hh, int ex){
        int th = hh + sep;
        int spaces = (int) (height/th)+ex;
        for(int i = 0; i <= spaces; i++){
            batch.draw(txt, xx, yy+(i*th), ww, hh);
        }
    }

    public static void draw_sprite(SpriteBatch batch, Texture txt, float xx, float yy, float alpha){
        setAlpha(batch, alpha);
        batch.draw(txt, xx, yy);
        setAlpha(batch, 1f);
    }

    private static void draw_sprite(SpriteBatch batch, Texture txt, float xx, float yy, float ww, float hh){
        batch.draw(txt, xx, yy, ww, hh);
    }
    private static void draw_sprite(SpriteBatch batch, Sprite txt, float xx, float yy, float ww, float hh, float xsc, float ysc, float rot, float ox, float oy){
        batch.draw(txt, xx, yy, ox, oy, ww, hh, xsc, ysc, rot);
    }

    public static void draw_centered(SpriteBatch batch, Texture txt, float xx, float yy){
        float ww = txt.getWidth(), hh = txt.getHeight();
        draw_sprite(batch, txt, xx-(ww/2), yy-(hh/2), ww, hh);
    }
    public static void draw_centered(SpriteBatch batch, Sprite spr, float xx, float yy){
        //batch.draw(spr, xx-(spr.getWidth()/2), yy-(spr.getHeight()/2));
        float ww = spr.getWidth(), hh = spr.getHeight();
        draw_sprite(batch, spr, xx-(ww/2), yy-(hh/2), spr.getWidth(), spr.getHeight(), 1, 1, 0, 0, 0);
    }
    public static void draw_centered(SpriteBatch batch, Texture txt, float xx, float yy, float xsc, float ysc){
        float ww = txt.getWidth()*xsc, hh = txt.getHeight()*ysc;
        draw_sprite(batch, txt, xx-(ww/2), yy-(hh/2), ww, hh);
    }
    public static void draw_centered(SpriteBatch batch, Sprite spr, float xx, float yy, float xsc, float ysc){
        //batch.draw(spr, xx-(spr.getWidth()/2), yy-(spr.getHeight()/2));
        float ww = spr.getWidth()*xsc, hh = spr.getHeight()*ysc;
        draw_sprite(batch, spr, xx-(ww/2), yy-(hh/2), spr.getWidth(), spr.getHeight(), xsc, ysc, 0, 0, 0);
    }
    public static void draw_centered(SpriteBatch batch, Sprite spr, float xx, float yy, float rot){
        //batch.draw(spr, xx-(spr.getWidth()/2), yy-(spr.getHeight()/2));
        float ww = spr.getWidth(), hh = spr.getHeight();
        draw_sprite(batch, spr, xx-(ww/2), yy-(hh/2), spr.getWidth(), spr.getHeight(), 1, 1, rot, ww/2, hh/2);
    }
    public static void draw_centered(SpriteBatch batch, Sprite spr, float xx, float yy, float xsc, float ysc, float rot){
        float ww = spr.getWidth(), hh = spr.getHeight();
        draw_sprite(batch, spr, xx, yy, ww, hh, xsc, ysc, rot, ww/2, hh/2);
    }

    public static void draw_number(SpriteBatch batch, Texture[] sprNum, int num, float xx, float yy){
        draw_number_calculate(batch, sprNum, num, xx, yy, 1);
    }
    public static void draw_number(SpriteBatch batch, Texture[] sprNum, int num, float xx, float yy, float sc){
        draw_number_calculate(batch, sprNum, num, xx, yy, sc);
    }

    public static void draw_number_calculate(SpriteBatch batch, Texture[] sprNum, int num, float xx, float yy, float sc){
        if(num < 0)num = 0;
        int div = 1;
        if(num >= 10)div = 2;
        if(num >= 100)div = 3;
        int[] spots = new int[div];
        switch(div){
            default:
            case 1: spots[0] = num; break; // -
            case 2: // -, -
                spots[0] = num%10; // -, *
                spots[1] = num/10; // *, -
                break;
            case 3: // -, -, -
                spots[0] = num%10; // -, -, *
                spots[1] = num/10 - ((num/100)*10); // -, *, -
                spots[2] = num/100; // *, -, -
                break;
        }
        for(int i = 0; i < div; i++){
            int spot_i = (spots.length - i) - 1;
            draw_centered(batch, sprNum[spots[i]], xx+((11*sc)*spot_i), yy, sc, sc);
        }
    }

    public static void draw_symbol(SpriteBatch batch, Texture[] sprSym, int[] symID, float xx, float yy){
        for(int i = 0; i < symID.length; i++){
            draw_symbol(batch, sprSym, symID[i], xx+(11*i), yy);
        }
    }
    public static void draw_symbol(SpriteBatch batch, Texture[] sprSym, int symID, float xx, float yy){
        draw_centered(batch, sprSym[symID], xx, yy);
    }

    public static void draw_line(SpriteBatch batch, Texture txt, Vector2 post, Vector2 post2, int size, int sep){
        float dis = getDistance(post, post2);
        double angle = degToRad(getDirection(post, post2));
        //draw_centered(batch, txt, post.x, post.y, 5, 5);
        //draw_centered(batch, txt, post2.x, post2.y, 5, 5);
        int truesize = size+sep;
        int spaces = (int) (dis/truesize);
        for(int i = 0; i < spaces; i++){
            float xx = post.x + lengthdir_x((size*i)+(sep*i), angle), yy = post.y + lengthdir_y((size*i)+(sep*i), angle);
            batch.draw(txt, xx, yy, size, size);
        }
    }

    public static int boolDif(boolean b1, boolean b2){
        if(b1){
            if(b2)return 0;
            return 1;
        }
        if(b2)return -1;
        return 0;
    }

    public static float Float_Restrict(float value, float end1, float end2){
        float mini = Math.min(end1, end2);
        float maxi = Math.max(end1, end2);
        if(value < mini)return mini;
        if(value > maxi)return maxi;
        return value;
    }

    public static void Vector_Restrict(Vector2 vect, float end1x, float end2x, float end1y, float end2y){
        vect.set(Float_Restrict(vect.x, end1x, end2x), Float_Restrict(vect.y, end1y, end2y));
    }

    public static float difference(float f1, float f2){
        return Math.abs(f1 - f2);
    }

    public static int string_width(String str, int font_size){
        return (str.length()*font_size);
    }

    public static void font_draw_centered(BitmapFont fnt, SpriteBatch batch, String str, int font_size, float xx, float yy){
        int strw = (int) (Tools.string_width(str, font_size) / 2.8);
        int strh = (int) (font_size / 2.8);
        fnt.draw(batch, str, xx-strw, yy+strh);
    }

    public static Preferences pref_get(String directory){
        return Gdx.app.getPreferences("com.mustardplus.verticcal."+directory);
    }

    public static int pref_quick_get(String directory, String key, int def){
        Preferences pref = pref_get(directory);
        int value =  pref.getInteger(key, def);
        pref.flush();
        return value;
    }

    public static void pref_quick_set(String directory, String key, int value){
        Preferences pref = pref_get(directory);
        pref.putInteger(key, value);
        pref.flush();
    }
    public static void pref_quick_set(String directory, String key, String value){
        Preferences pref = pref_get(directory);
        pref.putString(key, value);
        pref.flush();
    }
    public static void pref_quick_set(String directory, String key, float value){
        Preferences pref = pref_get(directory);
        pref.putFloat(key, value);
        pref.flush();
    }
    public static void pref_quick_set(String directory, String key, boolean value){
        Preferences pref = pref_get(directory);
        pref.putBoolean(key, value);
        pref.flush();
    }

    public static float lengthdir_x(float len, double rad){
        return (float) Math.cos(rad)*len;
    }
    public static float lengthdir_y(float len, double rad){
        return (float) Math.sin(rad)*len;
    }

}
